using System;
using System.Collections.Generic;
using System.EnterpriseServices.CompensatingResourceManager;
using System.Net.Http;
using System.Text.Json;
using System.Web.UI;

namespace LicenseAdminPortal
{
    public partial class Dashboard : System.Web.UI.Page
    {
        private const string ClientId = "";
        private const string ClientSecret = "";

        // ✅ Matches Google Console exactly
        private const string RedirectUri = "https://localhost:44356/Dashboard.aspx";

        protected void Page_Load(object sender, EventArgs e)
        {
            // ✅ STEP 1 — Check if Google sent a code back
            string code = Request.QueryString["code"];
            string error = Request.QueryString["error"];

            System.Diagnostics.Debug.WriteLine("=== Dashboard Page_Load ===");
            System.Diagnostics.Debug.WriteLine("Code  : " + code);
            System.Diagnostics.Debug.WriteLine("Error : " + error);

            // ── Google returned error (user cancelled) ──
            if (!string.IsNullOrEmpty(error))
            {
                System.Diagnostics.Debug.WriteLine("Google error: " + error);
                // Just show login screen
                ClientScript.RegisterStartupScript(this.GetType(), "userdata",
                    "var SERVER_USER = { isLoggedIn: false };", true);
                return;
            }

            // ── Google returned a code → exchange it for user details ──
            if (!string.IsNullOrEmpty(code))
            {
                System.Diagnostics.Debug.WriteLine("Code received from Google ✅ — exchanging...");

                var userDetails = ExchangeCodeForUserDetails(code);

                if (userDetails != null)
                {
                    System.Diagnostics.Debug.WriteLine("Login success: " + userDetails.Email);

                    // ✅ Save in Session
                    Session["IsLoggedIn"] = true;
                    Session["UserName"] = userDetails.Name;
                    Session["UserEmail"] = userDetails.Email;
                    Session["UserPicture"] = userDetails.Picture;
                    Session["UserInitials"] = GetInitials(userDetails.Name);

                    // ✅ Pass to JavaScript
                    // ✅ Add UserPicture to the script — already saving it, just pass it to JS
                    // ✅ When building the script — escape the picture URL
                    string script = string.Format(
                        "var SERVER_USER = {{ name: '{0}', email: '{1}', initials: '{2}', picture: '{3}', isLoggedIn: true }};",
                        userDetails.Name?.Replace("'", "\\'") ?? "",
                        userDetails.Email?.Replace("'", "\\'") ?? "",
                        GetInitials(userDetails.Name),
                        userDetails.Picture?.Replace("'", "\\'") ?? ""   // ✅ escape single quotes in URL
                    );

                    ClientScript.RegisterStartupScript(this.GetType(), "userdata", script, true);
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("❌ Failed to get user details");
                    ClientScript.RegisterStartupScript(this.GetType(), "userdata",
                        "var SERVER_USER = { isLoggedIn: false };", true);
                }

                return;
            }

            // ── STEP 2 — No code from Google — check existing Session ──
            if (Session["IsLoggedIn"] != null && (bool)Session["IsLoggedIn"])
            {
                string userName = Session["UserName"]?.ToString() ?? "User";
                string userEmail = Session["UserEmail"]?.ToString() ?? "";
                string userInitials = Session["UserInitials"]?.ToString() ?? "?";
                string userPicture = Session["UserPicture"]?.ToString() ?? "";  // ✅ Add this

                string script = string.Format(
                    "var SERVER_USER = {{ name: '{0}', email: '{1}', initials: '{2}', picture: '{3}', isLoggedIn: true }};",
                    userName?.Replace("'", "\\'") ?? "",
                    userEmail?.Replace("'", "\\'") ?? "",
                    userInitials,
                    userPicture?.Replace("'", "\\'") ?? ""   // ✅ escape single quotes
                );
                
                ClientScript.RegisterStartupScript(this.GetType(), "userdata", script, true);
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("No session — showing login screen");
                ClientScript.RegisterStartupScript(this.GetType(), "userdata",
                    "var SERVER_USER = { isLoggedIn: false };", true);
            }
        }

        // ── Called when Sign In button clicked ──
        protected void LoginWithGoogle(object sender, EventArgs e)
        {
            var scope = "openid%20email%20profile";
            var oauthUrl = string.Format(
                "https://accounts.google.com/o/oauth2/v2/auth?client_id={0}&redirect_uri={1}&response_type=code&scope={2}&access_type=offline&prompt=consent",
                ClientId, RedirectUri, scope
            );

            System.Diagnostics.Debug.WriteLine("Redirecting to Google: " + oauthUrl);
            Response.Redirect(oauthUrl);
        }

        // ============================================
        // Exchange code for user details
        // ============================================
        private UserDetails ExchangeCodeForUserDetails(string code)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    // Step 1: Get access token
                    var tokenPayload = new Dictionary<string, string>
                    {
                        { "code",          code          },
                        { "client_id",     ClientId      },
                        { "client_secret", ClientSecret  },
                        { "redirect_uri",  RedirectUri   },
                        { "grant_type",    "authorization_code" }
                    };

                    System.Diagnostics.Debug.WriteLine("Calling token endpoint...");

                    var tokenResponse = client.PostAsync(
                        "https://oauth2.googleapis.com/token",
                        new FormUrlEncodedContent(tokenPayload)
                    ).Result;

                    var tokenResponseBody = tokenResponse.Content.ReadAsStringAsync().Result;
                    System.Diagnostics.Debug.WriteLine("Token response: " + tokenResponseBody);

                    var tokenJson = JsonDocument.Parse(tokenResponseBody).RootElement;

                    if (tokenJson.TryGetProperty("error", out var tokenError))
                    {
                        System.Diagnostics.Debug.WriteLine("Token error: " + tokenError.GetString());
                        return null;
                    }

                    string accessToken = tokenJson.GetProperty("access_token").GetString();
                    System.Diagnostics.Debug.WriteLine("Access token received ✅");

                    // Step 2: Get user info
                    client.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                    var userResponseBody = client.GetStringAsync(
                        "https://www.googleapis.com/oauth2/v2/userinfo"
                    ).Result;

                    System.Diagnostics.Debug.WriteLine("User info: " + userResponseBody);

                    var userJson = JsonDocument.Parse(userResponseBody).RootElement;

                    // ✅ CORRECT — safely handles missing fields
                    return new UserDetails
                    {
                        Id = userJson.TryGetProperty("id", out var id) ? id.GetString() : "",
                        Email = userJson.TryGetProperty("email", out var email) ? email.GetString() : "",
                        Name = userJson.TryGetProperty("name", out var name) ? name.GetString() : "",
                        Picture = userJson.TryGetProperty("picture", out var picture) ? picture.GetString() : "",
                        GivenName = userJson.TryGetProperty("given_name", out var givenName) ? givenName.GetString() : "",
                        FamilyName = userJson.TryGetProperty("family_name", out var familyName) ? familyName.GetString() : ""
                    };
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("ExchangeCode Error: " + ex.ToString());
                return null;
            }
        }

        // ============================================
        // Get Initials from name
        // ============================================
        private string GetInitials(string fullName)
        {
            if (string.IsNullOrEmpty(fullName)) return "?";
            var parts = fullName.Trim().Split(' ');
            if (parts.Length >= 2)
                return (parts[0][0].ToString() + parts[parts.Length - 1][0].ToString()).ToUpper();
            return parts[0][0].ToString().ToUpper();
        }

        // ============================================
        // User Model
        // ============================================
        public class UserDetails
        {
            public string Id { get; set; }
            public string Email { get; set; }
            public string Name { get; set; }
            public string Picture { get; set; }
            public string GivenName { get; set; }
            public string FamilyName { get; set; }
        }
    }
}