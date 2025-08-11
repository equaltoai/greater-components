# Security Policy

## Overview

Security is a top priority for Greater Components. This document outlines our security practices, supported versions, and how to report security vulnerabilities.

## Supported Versions

We provide security updates for the following versions of Greater Components:

| Version | Support Status | End of Life |
|---------|---------------|-------------|
| 1.x.x   | ✅ Active support | TBD |
| 0.x.x   | ❌ Pre-release, not supported | N/A |

### Support Policy

- **Current Major Version**: Receives all security updates, bug fixes, and new features
- **Previous Major Version**: Receives security updates and critical bug fixes for 12 months after the next major release
- **Older Versions**: Community support only, no official security updates

## Security Standards

Greater Components follows industry-standard security practices:

### Supply Chain Security

- **npm Provenance**: All packages are published with npm provenance signatures
- **Dependency Scanning**: Regular automated scanning for vulnerabilities in dependencies
- **SBOM Generation**: Software Bill of Materials available for all releases
- **Signed Commits**: All releases are from signed commits by maintainers

### Code Security

- **Static Analysis**: Automated security scanning with CodeQL and Semgrep
- **Dependency Updates**: Automated dependency updates with security patches
- **Secure Development**: Security reviews for all major changes
- **Input Validation**: All user inputs are properly validated and sanitized

### Build & Release Security

- **Secure CI/CD**: GitHub Actions with minimal permissions and secure workflows
- **Release Automation**: Automated releases reduce manual errors and security risks
- **Artifact Integrity**: All released artifacts are checksummed and signed
- **Environment Isolation**: Build environments are isolated and ephemeral

## Security Features

Greater Components includes security features by default:

### Content Security

- **HTML Sanitization**: Built-in XSS protection in content rendering components
- **Safe Defaults**: Components default to secure configurations
- **Input Validation**: Client-side validation with server-side verification patterns
- **Content Type Enforcement**: Proper MIME type handling for media uploads

### Authentication & Authorization

- **Secure Token Handling**: Best practices for OAuth and API token management
- **CSRF Protection**: Built-in CSRF protection patterns
- **Secure Cookies**: Secure cookie configuration examples
- **Session Management**: Secure session handling recommendations

### Privacy Protection

- **Data Minimization**: Components only request necessary data
- **Local Storage Security**: Secure local storage patterns
- **Privacy Controls**: User privacy preference components
- **Tracking Prevention**: No unauthorized tracking or analytics

## Reporting Security Vulnerabilities

We take security vulnerabilities seriously and appreciate responsible disclosure.

### How to Report

**🚨 DO NOT report security vulnerabilities in public issues or discussions.**

Instead, please report security vulnerabilities privately:

1. **Email**: Send details to `security@equalto.ai`
2. **Encryption**: Use our PGP key for sensitive information (see below)
3. **Response Time**: We will acknowledge receipt within 24 hours
4. **Updates**: Regular updates on investigation progress

### PGP Public Key

For sensitive vulnerability reports, encrypt your message with our PGP key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[PGP key would go here in real implementation]
-----END PGP PUBLIC KEY BLOCK-----
```

### What to Include

When reporting a security vulnerability, please include:

1. **Component/Package**: Which Greater Components package is affected
2. **Version**: Specific version number where vulnerability exists
3. **Vulnerability Type**: XSS, CSRF, injection, etc.
4. **Impact Assessment**: Potential impact and severity
5. **Reproduction Steps**: Detailed steps to reproduce the issue
6. **Proof of Concept**: Code example demonstrating the vulnerability
7. **Suggested Fix**: If you have ideas for fixing the issue
8. **Disclosure Timeline**: Your preferred disclosure timeline

### Example Report Template

```
Subject: [SECURITY] Vulnerability in @greater/primitives Modal component

Component: @greater/primitives Modal
Version: 1.0.5
Severity: High
Type: XSS vulnerability

Description:
The Modal component is vulnerable to XSS attacks when rendering 
user-provided content in the title prop without proper sanitization.

Impact:
An attacker could inject malicious scripts that execute in the 
context of the application, potentially accessing user data or 
performing unauthorized actions.

Reproduction:
1. Import Modal from @greater/primitives
2. Set title prop to: `<img src=x onerror=alert('XSS')>`
3. Open the modal
4. JavaScript alert executes

Suggested Fix:
Sanitize the title prop before rendering, or use textContent 
instead of innerHTML for title rendering.

Proof of Concept:
[Code example here]
```

## Vulnerability Response Process

Our security response process follows these steps:

### 1. Initial Response (24 hours)

- Acknowledge receipt of the vulnerability report
- Assign a tracking identifier
- Initial impact assessment
- Form response team if needed

### 2. Investigation (1-7 days)

- Reproduce and validate the vulnerability
- Assess impact and affected versions
- Develop and test fix
- Coordinate with reporter on timeline

### 3. Fix Development (3-14 days)

- Develop comprehensive fix
- Create test cases to prevent regression
- Review fix with security team
- Prepare security advisory

### 4. Coordinated Disclosure

- Agree on disclosure date with reporter
- Prepare public security advisory
- Create CVE if applicable
- Plan release strategy

### 5. Public Disclosure

- Release patched version
- Publish security advisory
- Credit reporter (if desired)
- Update security documentation

## Security Advisories

Security advisories are published in multiple locations:

1. **GitHub Security Advisories**: [github.com/equaltoai/greater-components/security/advisories](https://github.com/equaltoai/greater-components/security/advisories)
2. **npm Security Advisory Database**: Automatic submission for npm packages
3. **CVE Database**: For significant vulnerabilities
4. **Release Notes**: Security fixes highlighted in changelog
5. **Community Notifications**: Posted in GitHub Discussions and social media

### Advisory Format

Our security advisories include:

- **CVSS Score**: Common Vulnerability Scoring System rating
- **Affected Versions**: Specific version ranges affected
- **Fixed Versions**: Version that resolves the vulnerability
- **Workarounds**: Temporary mitigation strategies
- **Timeline**: Discovery to fix timeline
- **Credits**: Recognition for reporters

## Security Best Practices

### For Users

When using Greater Components in your applications:

1. **Keep Updated**: Regularly update to the latest versions
2. **Monitor Advisories**: Subscribe to security notifications
3. **Review Dependencies**: Audit your dependency tree regularly
4. **Validate Inputs**: Always validate and sanitize user inputs
5. **Implement CSP**: Use Content Security Policy headers
6. **Use HTTPS**: Always serve applications over HTTPS
7. **Security Headers**: Implement security headers (HSTS, X-Frame-Options, etc.)

### For Contributors

When contributing to Greater Components:

1. **Secure Coding**: Follow secure coding practices
2. **Input Validation**: Validate all inputs and props
3. **Output Encoding**: Properly encode outputs to prevent XSS
4. **Dependency Management**: Keep dependencies updated
5. **Security Review**: Request security review for significant changes
6. **Testing**: Include security test cases

## Security Resources

### Tools and Scanners

We recommend these tools for security testing:

- **Static Analysis**: ESLint with security plugins, Semgrep
- **Dependency Scanning**: npm audit, Snyk, GitHub Dependabot
- **Runtime Testing**: OWASP ZAP, Burp Suite
- **Accessibility**: axe-core for inclusive security

### Educational Resources

- [OWASP Web Application Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE/SANS Top 25 Software Errors](https://cwe.mitre.org/top25/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Compliance

Greater Components aims to support compliance with:

- **SOC 2 Type II**: Security and availability principles
- **GDPR**: Privacy by design principles
- **WCAG 2.1 AA**: Accessible security practices
- **FIPS 140-2**: Where applicable for cryptographic modules

## Contact Information

### Security Team

- **Primary Contact**: `security@equalto.ai`
- **Response Time**: Within 24 hours
- **Languages**: English (primary), Spanish, French

### Escalation

For urgent security issues:

- **Phone**: Available for critical vulnerabilities
- **Encrypted Communication**: Signal, Wire, or PGP email
- **Emergency Contact**: Available 24/7 for critical issues

## Acknowledgments

We gratefully acknowledge security researchers who responsibly disclose vulnerabilities:

### Hall of Fame

*Security researchers who have helped improve Greater Components security will be listed here with their permission.*

### Responsible Disclosure Program

We recognize and appreciate:

- **Public Recognition**: Credit in security advisories and release notes
- **Swag/Rewards**: Greater Components merchandise for valid reports
- **Direct Communication**: Access to our security team for questions
- **Priority Support**: Enhanced support for security-focused users

---

## Frequently Asked Questions

### Q: How quickly are security vulnerabilities fixed?

**A:** Our target is to release security patches within 14 days of confirmation, with critical vulnerabilities addressed within 7 days.

### Q: Do you have a bug bounty program?

**A:** Not currently, but we recognize all legitimate security reports and provide appropriate credit and appreciation.

### Q: How can I stay updated on security issues?

**A:** Watch our GitHub repository, subscribe to security advisories, and follow our release notes for security updates.

### Q: What should I do if I think I'm affected by a vulnerability?

**A:** Update to the latest version immediately, review the security advisory for workarounds, and contact us if you need assistance.

### Q: Can I request a security review of my implementation?

**A:** Enterprise support customers can request implementation reviews. For community members, we provide general guidance through GitHub Discussions.

---

*This security policy is reviewed and updated regularly. Last updated: August 11, 2025*

*For questions about this security policy, contact: `security@equalto.ai`*