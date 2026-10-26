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

## 3. Test Case Matrix (S1-TST-02)

| Test Case ID | Feature | Precondition | Test Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-REG-001** | Registration | Visitor on Register page | Fill name, valid new email, password; click Register | Account created as `pending` / `User`; success message shown | Untested |
| **TC-REG-002** | Registration | Existing user email in DB | Fill form using existing email; click Register | Error message: "Email address already registered" | Untested |
| **TC-AUTH-001** | Login | Active user created | Enter valid email and password; click Sign In | Redirected to `/dashboard` | Untested |
| **TC-AUTH-002** | Login | Account blocked by Admin | Enter valid credentials for blocked user; click Sign In | Error message: "Account is blocked" | Untested |
| **TC-PWD-001** | Password Reset | Registered user | Request reset link; open link; enter new password | Password updated; login succeeds with new password | Untested |
| **TC-PWD-002** | Password Reset | Expired reset token | Open expired reset link; submit new password | Error message: "Reset link has expired" | Untested |
| **TC-DASH-001** | Landing Page | Logged in as `User` | Navigate to `/dashboard` | Sidebar shows only granted modules (e.g., HR hidden/greyed out) | Untested |