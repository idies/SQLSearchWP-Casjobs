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
<div class="form sqls-form">
<form id="sqls-form" class="sqls-form collapse">
<div class="row">
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<div class="row">
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-edit" name="sqls-edit" class ="sqls-edit btn btn-primary btn-dr14" data-unlock="yes">Unlock</button>
</div>
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-syntax" name="sqls-syntax" data-sqls-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="sqls-syntax btn btn-warning btn-dr14">Check Syntax</button>
</div>
</div>
<div class="row">
<div class="col-xs-12 col-sm-12 col-md-12 text-center">
<p><strong>QUERY DR14</strong></p>
<textarea id="sqls-query" name="cmd" class="sqls-query" data-colnum=60 rows=10 cols=30 disabled>SELECT TOP 10 p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z,p.run, p.rerun, p.camcol, p.field, s.specobjid, s.class, s.z as redshift,s.plate, s.mjd, s.fiberid FROM PhotoObj AS p JOIN SpecObj AS s ON s.bestobjid = p.objid WHERE p.u BETWEEN 0 AND 19.6 AND g BETWEEN 0 AND 20</textarea>
</div>
</div>
<div class="row">
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-reset" name="sqls-reset" class="sqls-reset btn btn-danger btn-dr14">Reset</button>
</div>
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-submit" name="sqls-submit" class="sqls-submit btn btn-success btn-dr14">Submit</button>
<div class="checkbox">
  <label><input id="sqls-newWindow" type="checkbox" data-value="no">Open Results in New Tab</label>
</div>
</div>
</div>
</div>
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<a role="button" data-toggle="collapse" href="#sqls-results-outer" aria-expanded="false" aria-controls="sqls-results"><strong>RESULTS</strong></a>
<div id="sqls-results-outer" class="sqls-results collapse">
<div id="sqls-results" class="sqls-results"></div>
<button id="sqls-download" style="display:none;" name="sqls-download" class ="sqls-download btn btn-primary btn-dr14">Download</button>
</div>
</div>
</div>
</form>
</div>
</div>
EOT;
?>