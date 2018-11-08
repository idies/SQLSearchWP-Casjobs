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
<div id="sqls-lock" style=""><span class="glyphicon glyphicon-lock"></span></div>
<textarea id="sqls-query" name="cmd" class="sqls-query" data-colnum=60 rows=10 cols=30 disabled>select top 10 p.objid, p.ra, p.dec, p.g, p.r, s.z from photoObj p
join specObj s on s.bestobjid = p.objid
where p.ra between -0.1 and 0.1
and p.dec between -0.1 and 0.1</textarea>
</div>
</div>
<div class="row">
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-reset" name="sqls-reset" class="sqls-reset btn btn-danger btn-dr14">Reset</button>
</div>
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<button id="sqls-submit" name="sqls-submit" class="sqls-submit btn btn-success btn-dr14">Submit</button>
<div class="checkbox">
  <label><input type="checkbox" id="sqls-newWindow" data-value="no">Open in New Tab</label>
  <a href="#" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-info-sign"></span></a>
</div>
<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-sm sqls-modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Important</h4>
        </div>
        <div class="modal-body">
          Be sure to enable pop-ups on this site to allow results to open in a new tab.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default btn-primary btn-dr14" data-dismiss="modal">Close</button>
        </div>
      </div>
      
    </div>
  </div>
  
  
</div>
</div>
</div>
<div class="col-xs-12 col-sm-12 col-md-6 text-center">
<a role="button" data-toggle="collapse" href="#sqls-results-outer" aria-expanded="false" aria-controls="sqls-results"><strong>RESULTS</strong></a>
<div id="sqls-hour" style="display: none;"><span class="glyphicon glyphicon-hourglass"></span></div>
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