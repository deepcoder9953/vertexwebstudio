# Send enquiries to a Google Sheet

1. Create a new Google Sheet (e.g. "Vertex Enquiries") in the Google account that should own the data.
2. In the sheet: **Extensions > Apps Script**. Delete the sample code and paste all of `Code.gs`. Save.
3. **Deploy > New deployment > Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, approve the permissions (Advanced > Go to project), and copy the **Web app URL** (ends in `/exec`).
4. Open `assets/config.js` and set `"sheet"` to that URL, then publish the site.
5. Submit a test enquiry from contact.html. A row appears in the **Enquiries** tab (created automatically).

If you later edit the script, use **Deploy > Manage deployments > Edit > New version** so the same URL keeps working.
