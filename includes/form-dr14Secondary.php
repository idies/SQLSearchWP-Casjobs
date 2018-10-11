<?php 
$result .= <<<EOT
<div class="row">
<div class="col-lg-12">
<div class="sqls-messages-wrap">
<div class="sqls-messages"></div>
</div>
</div>
<div class="col-xs-12">
<div class="sqls-instructions-wrap well well-sm"> 
<h2><a role="button" data-toggle="collapse" href="#sqls-instructions" aria-expanded="true" aria-controls="sqls-instructions">Instructions</a></h2>
<div id="sqls-instructions" class="sqls-instructions collapse"></div> 
</div>
<h2><a role="button" data-toggle="collapse" href="#sqls-form" aria-expanded="true" aria-controls="sqls-form">SQL Search</a></h2>
<div class="form sqls-form collapse show">
<form id="sqls-form">
<div class="row">
<div class="col-xs-12 col-sm-8 col-md-5 text-center">
<p><strong>QUERY</strong></p>
<textarea id="sqls-query" name="cmd" class="sqls-query" data-colnum=60 rows=10 cols=30 disabled>SELECT TOP 10 p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z,p.run, p.rerun, p.camcol, p.field, s.specobjid, s.class, s.z as redshift,s.plate, s.mjd, s.fiberid FROM PhotoObj AS p JOIN SpecObj AS s ON s.bestobjid = p.objid WHERE p.u BETWEEN 0 AND 19.6 AND g BETWEEN 0 AND 20</textarea>
</div>
<div class="col-xs-12 col-sm-4 col-md-2 text-center">
<p><strong>ACTIONS</strong></p>
<table>
<tr><td><button id="sqls-edit" name="sqls-edit" class ="sqls-edit btn btn-primary btn-dr14" data-unlock="yes">Edit</button></td></tr>
<tr><td><button id="sqls-syntax" name="sqls-syntax" data-sqls-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="sqls-syntax btn btn-warning btn-dr14">Check Syntax</button></td></tr>
<tr><td><button id="sqls-submit" name="sqls-submit" class="sqls-submit btn btn-success btn-dr14">Submit</button></td></tr>
<tr><td><button id="sqls-download" name="sqls-download" class ="sqls-download btn btn-primary btn-dr14">Download</button></td></tr>
<tr><td><button id="sqls-reset" name="sqls-reset" class="sqls-reset btn btn-danger btn-dr14">Reset</button></td></tr>
</table>
</div>
<div class="col-xs-12 col-sm-12 col-md-5 text-center">
<div class="checkbox">
  <label><input id="sqls-newWindow" type="checkbox" data-value="no">Open Results in New Tab</label>
</div>
<a role="button" data-toggle="collapse" href="#sqls-results" aria-expanded="false" aria-controls="sqls-results"><strong>RESULTS</strong></a>
<div id="sqls-results" class="sqls-results"></div>
</div>
</div>
</form>
</div>
</div>
EOT;
?>