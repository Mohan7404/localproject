<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="LicenseAdminPortal.Dashboard" %>
<!DOCTYPE html>
<html lang="en">
<head runat="server">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HIMS Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="Styles/dashboard.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="app">

            <%-- ===== LOGIN SCREEN ===== --%>

            <div id="auth-screen" class="screen">
                <div class="auth-card">
                    <div class="logo-container">
                        <div class="logo-box">
                            <div class="logo-inner"></div>
                        </div>
                    </div>
                    <h1>Welcome to Sample Code</h1>
                    <p>Sign in with Google to access your dashboard</p>

                    <%-- Change this button to ASP.NET server button --%>
                   <%-- <asp:Button ID="Button1" runat="server"
                        OnClick="LoginWithGoogle"
                        CssClass="google-btn"
                        Text=""
                        UseSubmitBehavior="true" />--%>


                  <asp:LinkButton ID="btnGoogleLogin" runat="server"
                  OnClick="LoginWithGoogle" CssClass="google-btn" style="text-decoration: none;">

                 <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google" style="width:20px; vertical-align:middle;" />

                  <span style="margin-left:8px;">Sign in with Google</span>

                    </asp:LinkButton>


                    <%-- Keep the Google icon and text separately --%>
                  <%--  <button id="google-signin-btn" type="button" class="google-btn" onclick="document.getElementById('form1').submit()">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        <span>Sign in with Google</span>
                    </button>--%>


                    <div class="auth-footer">
                        By signing in, you agree to our <br />
                        <span class="link">Terms of Service</span> and <span class="link">Privacy Policy</span>.
                    </div>
                </div>
            </div>


            <%-- ===== DASHBOARD SCREEN ===== --%>
            <div id="dashboard-screen" class="screen hidden">

                <%-- Header --%>
                <header class="header">
                    <div class="header-content">
                        <div class="header-left">
                          <asp:Image ID="imgLogo" runat="server" 
    ImageUrl="~/Assests/suvarnalogo.png" 
    AlternateText="Suvarna Logo" 
    
    Height="40px" />
                            <span class="brand-name">HIMS</span>
                        </div>
<%--                        <div class="header-right">

                    <div class="user-info">

                        <div class="user-avatar" id="user-avatar-box">SM</div>

                        <div class="user-details">
                            <span class="user-name">Srikiran M</span>
                            <span class="user-email">srikiran@gmail.com</span>
                        </div>
                    </div>
                            
                            <button id="logout-btn" type="button" class="logout-btn">
                                <i data-lucide="log-out"></i>
                            </button>
                        </div>--%>

                        <div class="header-right">
                        <div id="user-menu-trigger" class="user-profile-trigger">
                            <span class="user-name">Srikiran M</span>
                            <div class="user-avatar-container">
                                <div class="user-avatar-inner">
                                    <i data-lucide="user" class="w-5 h-5"></i>
                                </div>
                            </div>
                            <i data-lucide="chevron-down" class="chevron-icon w-4 h-4"></i>
                        </div>

                        <!-- Dropdown Menu -->
                        <div id="user-dropdown" class="dropdown-menu">
                            <button id="logout-btn" class="dropdown-item logout">
                                <i data-lucide="log-out" class="w-4 h-4"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>


                    </div>
                </header>

                <%-- Main Content --%>
                <main class="main-container">
                    <div class="toolbar">
                        <div class="spacer"></div>

                        <%-- Search --%>
                        <div class="search-container">
                            <i data-lucide="search" class="search-icon"></i>
                            <input type="text" id="search-input" placeholder="Search clients..." />
                        </div>

                        <div class="actions">
                            <%-- Filter Buttons --%>
                            <div class="filter-group">
                                <button type="button" class="filter-btn active" data-filter="all">ALL</button>
                                <button type="button" class="filter-btn" data-filter="active">ACTIVE</button>
                            </div>

                            <%-- View Toggle --%>
                            <div class="view-toggle">
                                <button type="button" class="view-btn" data-view="card">
                                    <i data-lucide="layout-grid"></i>
                                </button>
                                <button type="button" class="view-btn active" data-view="grid">
                                    <i data-lucide="list"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <%-- Data renders here by JavaScript --%>
                    <div id="content-area" class="content-area"></div>
                </main>
            </div>

            <%-- ===== HISTORY MODAL ===== --%>
            <div id="history-dialog" class="modal hidden">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h3 id="modal-client-name">Client Name</h3>
                            <p id="modal-location-name">Location Name</p>
                        </div>
                        <button id="close-modal" type="button" class="close-btn">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="history-list" class="history-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button id="modal-close-btn" type="button" class="btn-secondary">Close</button>
                    </div>
                </div>
            </div>

        </div>
    </form>

    <%-- Load JS at the bottom so HTML loads first --%>
    <script src="Scripts/dashboard.js"></script>


</body>
</html>