# Sprint 1 QA Test Plan & Acceptance Criteria (S1-TST-01)

## 1. Scope & Objective
This test plan covers the Sprint 1 core authentication and access control features required for the Hope, Inc. ERP system:
1. User Login & Logout
2. Password Reset / Set Password
3. User Registration
4. Main Landing Page / Dashboard Navigation

---

## 2. Acceptance Criteria

### 2.1 User Login & Logout
* **AC-1.1 Valid Credentials:** Given a registered active user, when they enter correct credentials, then they are authenticated and redirected to the dashboard.
* **AC-1.2 Invalid Credentials:** Given any user, when they enter incorrect credentials, then access is denied with a generic error message ("Invalid email or password").
* **AC-1.3 Blocked Account Prevention:** Given a user whose account is set to `Blocked`, when they attempt to log in with valid credentials, then access is denied.
* **AC-1.4 Session Logout:** Given an authenticated user, when they click "Logout", then their session is destroyed and they are redirected to the sign-in screen.

### 2.2 Reset / Set Password
* **AC-2.1 Reset Link Request:** Given a registered user on the "Forgot Password" screen, when they submit their email, then a secure reset token link is generated.
* **AC-2.2 Expiry & Single-Use:** Given an expired or previously used reset token, when a user attempts to reset their password, then the system rejects the request.
* **AC-2.3 Password Security:** Passwords must be stored in the database as salted hashes (e.g., bcrypt), never plain text.

### 2.3 User Registration
* **AC-3.1 Account Creation:** Given a new visitor on the registration page, when they submit valid registration details, then an account is created with default status `pending` / role `User`.
* **AC-3.2 Duplicate Email:** Given an email already registered in the system, when a new registration uses that email, then a validation error is displayed.

### 2.4 Main Landing / Dashboard Navigation
* **AC-4.1 Role-Based Sidebar:** Given an authenticated user, when they land on the main page, then only the navigation links and modules granted to their role/rights are visible.
* **AC-4.2 Server-Side Guard:** Given an unprivileged user, if they attempt to access an unauthorized route or API endpoint directly, then the server responds with `403 Forbidden`.

---

## 3. Detailed Test Case Matrix (S1-TST-02)

### 3.1 User Registration Test Cases
| Test Case ID | Feature | Precondition | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-REG-001** | Registration | Visitor on Register page | 1. Enter valid Full Name<br>2. Enter unused Email<br>3. Enter strong Password<br>4. Click "Register" | Account created with default status `pending` / role `User`; redirected to success/login screen | Untested |
| **TC-REG-002** | Registration | User `user1@hope.com` exists | 1. Enter details using `user1@hope.com`<br>2. Click "Register" | Form submission blocked; error displays: "Email address already registered" | Untested |
| **TC-REG-003** | Registration | Visitor on Register page | 1. Enter valid name and email<br>2. Enter short password (< 8 chars)<br>3. Click "Register" | Form validation fails; error displays: "Password must be at least 8 characters" | Untested |

### 3.2 Authentication & Login Test Cases
| Test Case ID | Feature | Precondition | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | Login | Active user created | 1. Go to `/login`<br>2. Enter correct email & password<br>3. Click "Sign In" | Authenticated successfully; redirected to `/dashboard` | Untested |
| **TC-AUTH-002** | Login | Registered user | 1. Go to `/login`<br>2. Enter correct email & wrong password<br>3. Click "Sign In" | Login fails; error displays: "Invalid email or password" (generic error) | Untested |
| **TC-AUTH-003** | Login | Account status set to `Blocked` | 1. Go to `/login`<br>2. Enter valid credentials for blocked user<br>3. Click "Sign In" | Access denied; error displays: "Account is blocked" | Untested |
| **TC-AUTH-004** | Logout | User logged in | 1. Click user avatar/menu<br>2. Click "Sign Out" | Session destroyed, tokens cleared, user redirected to public landing page | Untested |

### 3.3 Password Reset Test Cases
| Test Case ID | Feature | Precondition | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PWD-001** | Password Reset | Registered user | 1. Go to "Forgot Password"<br>2. Enter registered email<br>3. Submit request | Reset token generated and email link sent | Untested |
| **TC-PWD-002** | Password Reset | Valid reset link received | 1. Open reset link<br>2. Enter new strong password<br>3. Submit form | Password updated in database as salted hash; success message displayed | Untested |
| **TC-PWD-003** | Password Reset | Reset token expired/used | 1. Open expired or reused reset link<br>2. Attempt to submit new password | Action blocked; error displays: "Reset token is invalid or expired" | Untested |

### 3.4 Dashboard & Authorization Test Cases
| Test Case ID | Feature | Precondition | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-DASH-001** | Landing | Authenticated as standard `User` | 1. Log in<br>2. Navigate to Dashboard | Sidebar displays only authorized modules (e.g., Admin tools hidden/disabled) | Untested |
| **TC-DASH-002** | Security | Authenticated as standard `User` | 1. Attempt direct URL navigation to `/admin/users`<br>2. Trigger admin API endpoint | Server responds with `403 Forbidden` | Untested |