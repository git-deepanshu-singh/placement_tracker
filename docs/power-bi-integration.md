# Power BI Integration Guide

This application uses **MongoDB Atlas** for placement workflows and analytics. There is no separate reporting database or sync step.

## Why MongoDB Only

- Deployment is simpler because the app needs only one database service.
- Dashboard data stays consistent with the operational collections.
- Analytics are computed by backend MongoDB aggregates in real time.

## MongoDB Collections

### `drives`

Used for placement-drive details:

- `companyName`
- `role`
- `deadline`
- `package_lpa`
- `status`

### `applications`

Used for application and selection analytics:

- `driveId`
- `studentId`
- `status`
- `metadata`

### `users`

Used for student, faculty, and admin data:

- `name`
- `email`
- `role`
- `department`
- `profile`

## Analytics Logic

The backend computes analytics directly from MongoDB in [backend/src/controllers/analyticsController.js](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/src/controllers/analyticsController.js). Placement summaries, company performance, and yearly trends are built from the same collections used by the app.

## Power BI Desktop Setup

1. Open Power BI Desktop.
2. Select `Get Data`.
3. Choose a MongoDB connector supported by your Power BI environment, or export reports from the app as Excel files.
4. Connect with a read-only MongoDB Atlas user.
5. Import the `drives`, `applications`, and `users` collections.
6. Build measures for placed counts, package trends, company-wise selections, and department-wise placement ratios.

## Suggested Dashboards

- Total placed students by year
- Company-wise selection count
- Highest and average package trend
- Department-wise placement ratio
- Placement readiness vs placement outcomes

## Scheduled Refresh

For Power BI Service:

1. Publish the report.
2. Configure the data source credentials in the workspace.
3. If MongoDB Atlas is private or IP-restricted, configure the required gateway/network access.
4. Set refresh cadence to every 1-6 hours depending on placement-season needs.

## Security

- Use a read-only MongoDB Atlas user for Power BI
- Restrict source IP ranges where possible
- Avoid storing operational secrets in Power BI Desktop files
