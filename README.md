<h1>SQLSearchWP-Casjobs</h1>
<h2>Overview</h2>
SQLSearchWP-Casjobs is a WordPress plugin that when implemented on a page displays a form for querying the SDSS astronomy database.
The form contains three main sections: Instructions, the search form itself, and Results. 
<h3>Instructions</h3>
The Instructions block displays first on the page and contains text directions for navigting the rest of the form. This section can be disabled if necessary (see <strong>Installation and Implementation</strong>).
<h3>Search Form</h3>
The search form occurs after instructions on the left side of the page. It contains a text box to hold the SQL code the user wishes to submit and four colored buttons.<br>
<strong>Unlock</strong> allows the user to edit the text box, which is disabled by default. Unlocking the text box will change the Unlock button to Lock, which when pressed re-locks the text box. The lock status of the text box is indicated by an image of a lock that will appear right above the text box when locked.<br>
<strong>Check Syntax</strong> performs a check for proper syntax for any SQL code currently in the text box. The results of the syntax check will appear in the Results section of the form.<br>
<strong>Submit</strong> processes any SQL code currently in the text box and queries the SDSS database. The results of the query are displayed in the Results section of the form. In addition, checking the <strong>Open in New Tab</strong> checkbox will also display any results in a new tab. Note: submitting incorrect SQL code could result in errors. Always use the <strong>Check Syntax</strong> feature to ensure correctness.<br>
<strong>Reset</strong> clears the Results section of the form. It does not affect anything else on the page, including the text box.
<h3>Results</h3>
The Results section occurs after Instructions to the right of the page. The results of running <strong>Check Syntax</strong> or <strong>Submit</strong> are displayed here. When no results are present, the message "Results Empty! Check Syntax or Submit to get results" displays. After displaying results from a <strong>Submit</strong>, a <strong>Download</strong> button will appear underneath the results table. Clicking this will download the results table as a .csv file named "results.csv".
<h2>Installation and Implementation</h2>
To install SQLSearchWP-Casjobs on a WordPress site, download the zip file of SQLSearchWP-Casjobs and extract it. Then, copy the entire folder into the wp-content/plugins directory for your site. SQlSearchWP-Casjobs should now be available under "Plugins" in the wp-admin dashboard. Click "activate" to enable the plugin on your site.<br>
Once installed, SQLSearchWP-Casjobs can be implemented on a page using the following shortcode: [sqlsearchwp-casjobs]. However, there are some required and optional parameters for this shortcode.<br>
<strong>num</strong>(required): This serves as the unique identifier for a certain form. As such, each form on a page must have a unique value for this parameter. Additionally, they must start at 0 and count up from there.
For example, three forms on the same page would look like: [sqlsearchwp-casjobs num="0"] [sqlsearchwp-casjobs num="1"] [sqlsearchwp-casjobs num="2"].<br>
<strong>default</strong>(optional): This serves as the default text to be displayed in the text box within the search form. For example, [sqlsearchwp-casjobs num="0" default="select top 10 from photoObj"]. There is a built in default query if this parameter is not utilized in the shortcode.<br>
<strong>color</strong>(optional): This dictates the color of the text within the search form text box. Any HTML supported color will work. For example, [sqlsearchwp-casjobs num="0" color="red"]. The default text color is black if this parameter is not utilized in the shortcode.<br>
<strong>instructions</strong>(optional): This says whether to display the Instructions section. Setting this parameter to "show" will display it, while setting it to "hide" will not display it. For example, [sqlsearchwp-casjobs num="0" instructions="hide"]. The default value is "show" if this parameter is not utilized in the shortcode.

