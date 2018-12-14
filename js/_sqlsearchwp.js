/* ========================================================================
 * sqlsearchwp v1.0.0
 * ========================================================================
 *
 * What it does:
 * 		Creates a sql search form that submits the form's query to 
 *		skyserverws.
 * 
 * Licensed under MIT 
 * ======================================================================== */
(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var SQLSDEBUG = true;

	var sqlsearchwp = {

		context: '#sqls-container',
		
		identity: '',
		
		levels: [
			'info',
			'warning',
			'danger',
		],
		
		buttons: [
			'submit',
			'images',
			'syntax',
			'clear'
		],
		
		whichs: [
			'test',
			'freeform',
			'searchform',
			'dr14',
			'dr14-secondary'
		],
		targets: {
		dr14:{
		    url:"https://skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
			sqlsearchwp.showResults( data , false , true, true, false );
		    }
		},
		dr14Secondary:{
		    url:"https://skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data, newWin) {
			sqlsearchwp.showResults( data , false , true, true, sqlsearchwp.newWin );
		    }
		}
		},
		newWin:false,
		/*query: { 
			test: 
				'SELECT TOP 10 '+
				'p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z, '+
				'p.run, p.rerun, p.camcol, p.field, '+
				's.specobjid, s.class, s.z as redshift, '+
				's.plate, s.mjd, s.fiberid '+
			'FROM PhotoObj AS p '+
				'JOIN SpecObj AS s ON s.bestobjid = p.objid '+
			'WHERE '+
				'p.u BETWEEN 0 AND 19.6 '+
			'AND g BETWEEN 0 AND 20' ,
			prod: ''
			},*/
			
		init: function(context){
			//console.log(php_vars.context);
			//sqlsearchwp.context = '#' + php_vars.context;
			sqlsearchwp.context = $(context);
			sqlsearchwp.identity = context.substring(context.length - 1, context.length);
			//console.log(sqlsearchwp.context);
						
			var s=sqlsearchwp;
			
			// get base url of files, test or prod query, target query location, and how to show results.
			var webroot = $( sqlsearchwp.context ).data('sqls-webroot');
			var which = $( sqlsearchwp.context ).data('sqls-which');
			var target = sqlsearchwp.targets[which];
			console.log(which);
			console.log(sqlsearchwp.context);
			
			//console.log(sqlsearchwp.context + " " + php_vars.color);
			
			//$(sqlsearchwp.context + " .sqls-query").prop("style","color: " + php_vars.color);
			
			//initialize query to be default text
			target.data.Query = "select top 10 p.objid, p.ra, p.dec, p.g, p.r, s.z from photoObj p join specObj s on s.bestobjid = p.objid where p.ra between -0.1 and 0.1 and p.dec between -0.1 and 0.1";
			// Show the Search Page
			//sqlsearchwp.showMessage( 'Welcome' , 'Please enjoy this form.' , 'info' , false );
			this.showInstructions( webroot+"includes/" );
			this.showForm( sqlsearchwp.context , false , true );
			this.showResults( '<pre>Results Empty!\n\n<strong>Check Syntax</strong> or <strong>Submit</strong> to get results</pre>' , false , false, false, false);
			
			// Prevent form submitting/reloading page
			$(".sqls-form", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			$(".sqls-searchform", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			
			// Add (delegated) click event handlers to buttons
			//$( sqlsearchwp.context ).on( "click" , "#sqls-submit" , sqlsearchwp.doSubmit );
			//console.log(sqlsearchwp.context);
			$(".sqls-edit", sqlsearchwp.context).on('click', sqlsearchwp.enableQuery);
			$(".sqls-query", sqlsearchwp.context).on('input', sqlsearchwp.doQueryUpdate);
			$(".sqls-download", sqlsearchwp.context).on('click', sqlsearchwp.download);
			$(".sqls-newWindow", sqlsearchwp.context).on('change', sqlsearchwp.updateCheckbox);
			$(".sqls-submit", sqlsearchwp.context).on( "click" , { target:target , which:which } , sqlsearchwp.doSubmit );
			$(".sqls-syntax", sqlsearchwp.context).on( "click" , sqlsearchwp.doSyntax );
			$(".sqls-reset", sqlsearchwp.context).on( "click" , sqlsearchwp.doReset );
			/*var uagent = navigator.userAgent.toLowerCase();
			if (uagent.search("iphone") > -1) {
				document.getElementById('sqls-form').innerHTML = '<table width=50%><tr><td><button id="sqls-edit" name="sqls-edit" class ="sqls-edit btn btn-primary" data-unlock="yes">Edit</button></td><td><button id="sqls-reset" name="sqls-reset" class="sqls-reset btn btn-tertiary">Reset</button></td></tr></table><textarea id="sqls-query" name="cmd" class="sqls-query" data-colnum=60 rows=10 cols=60 disabled>SELECT TOP 10 p.objid,p.ra,p.dec,p.u,p.g,p.r,p.i,p.z,p.run, p.rerun, p.camcol, p.field, s.specobjid, s.class, s.z as redshift,s.plate, s.mjd, s.fiberid FROM PhotoObj AS p JOIN SpecObj AS s ON s.bestobjid = p.objid WHERE p.u BETWEEN 0 AND 19.6 AND g BETWEEN 0 AND 20</textarea><table width=50%><tr>	<td><button id="sqls-submit" name="sqls-submit" class="sqls-submit btn btn-primary">Submit</button></td><td><button id="sqls-syntax" name="sqls-syntax" data-sqls-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="sqls-syntax btn btn-secondary">Check Syntax</button></td></tr></table>';
			}
			//document.getElementsByTagName("BODY")[0].onresize = sqlsearchwp.doResize;
			//sqlsearchwp.doResize();
				
			/*if ( which ==="searchform" ) {
				$( sqlsearchwp.context ).on( "click" , "#sqls-images" , sqlsearchwp.doSubmit );
				$( sqlsearchwp.context ).on( "change" , "#sqls-inregion" , sqlsearchwp.toggleFootprint );
				$( sqlsearchwp.context ).on( "change" , "#sqls-forobjects" , sqlsearchwp.toggleRedshifts );
				$( sqlsearchwp.context ).on( "click" , "#sqls-fpcheck" , sqlsearchwp.doFootprint );
				$( sqlsearchwp.context ).on( "click" , "#sqls-generate" , sqlsearchwp.doGenerate );
				$( 'form#sqls-searchform' ).on( "change" , "select" , sqlsearchwp.doUpdate );
				$( 'form#sqls-searchform' ).on( "change" , "input" , sqlsearchwp.doUpdate );
				}*/
			
		},
		
		/*correctIDs: function() {
			document.getElementById('sqls-instructions').id = 'sqls-instructions-' + sqlsearchwp.identity;
			document.getElementById('sqls-form').id = 'sqls-form-' + sqlsearchwp.identity;
			document.getElementById('sqls-edit').id = 'sqls-edit-' + sqlsearchwp.identity;
			document.getElementById('sqls-syntax').id = 'sqls-syntax-' + sqlsearchwp.identity;
			document.getElementById('sqls-lock').id = 'sqls-lock-' + sqlsearchwp.identity;
			document.getElementById('sqls-query').id = 'sqls-query-' + sqlsearchwp.identity;
			document.getElementById('sqls-reset').id = 'sqls-reset-' + sqlsearchwp.identity;
			document.getElementById('sqls-submit').id = 'sqls-submit-' + sqlsearchwp.identity;
			document.getElementById('sqls-newWindow').id = 'sqls-newWindow-' + sqlsearchwp.identity;
			document.getElementById('myModal').id = 'myModal-' + sqlsearchwp.identity;
			document.getElementById('sqls-hour').id = 'sqls-hour-' + sqlsearchwp.identity;
			document.getElementById('sqls-results-outer').id = 'sqls-results-outer-' + sqlsearchwp.identity;
			document.getElementById('sqls-results').id = 'sqls-results-' + sqlsearchwp.identity;
			document.getElementById('sqls-download').id = 'sqls-download-' + sqlsearchwp.identity;
			document.getElementById('sqls-results-wrap').id = 'sqls-results-wrap-' + sqlsearchwp.identity;
			document.getElementById('sqls-form-wrap').id = 'sqls-form-wrap-' + sqlsearchwp.identity;
			document.getElementById('sqls-formwrapper').id = 'sqls-formwrapper-' + sqlsearchwp.identity;
			//document.getElementsByName('instruct')[0].href = "#sqls-instructions-" + sqlsearchwp.identity;
			//document.getElementsByName('instruct')[0].name = "instruct-" + sqlsearchwp.identity;
			//document.getElementsByName('search')[0].href = "#sqls-form-" + sqlsearchwp.identity;
			//document.getElementsByName('search')[0].name = "search-" + sqlsearchwp.identity;
			//document.getElementsByName('mode')[0].href = "#myModal-" + sqlsearchwp.identity;
			//document.getElementsByName('mode')[0].name = "mode-" + sqlsearchwp.identity;
			//document.getElementsByName('result')[0].href = "#sqls-results-outer-" + sqlsearchwp.identity;
			//document.getElementsByName('result')[0].name = "result-" + sqlsearchwp.identity;
		},*/
		
		updateCheckbox: function(e) {
			console.log("new tab");
			var setting = e.currentTarget.dataset.value;
			if (setting === "no") {
				setting = "yes";
				sqlsearchwp.newWin = true;
				e.currentTarget.dataset.value = setting;
			} else {
				setting = "no";
				sqlsearchwp.newWin = false;
				e.currentTarget.dataset.value = setting;
			}
		},
		
		openWindow: function(content) {
			var type = 'text/html';
			var a = document.createElement("a");
			var file = new Blob([content], {type: type});
			//window.open(URL.createObjectURL(file));
			a.href = URL.createObjectURL(file);
			a.target = "_blank";
			a.click();
		},
		
		download: function(e) {
			//console.log('hi');
			var docText = sessionStorage.getItem('queryResults' + sqlsearchwp.identity);
			var lines = docText.split('\n');
			docText = '';
			for (var i = 0; i < lines.length-1; i++) {
				var values = lines[i].split(',');
				for (var x = 0; x < values.length; x++) {
					values[x] = '\"'.concat(values[x]);
					values[x] += '\"';
					docText += values[x];
					if (x !== values.length - 1) {
						docText += ',';
					}
				}
				if (i !== lines.length - 1) {
					docText += '\n';
				}
			}
			//console.log(docText);
			var name = 'results.csv';
			var type = 'text/csv';
            var a = document.createElement("a");
			var file = new Blob([docText], {type: type});
			//window.open(URL.createObjectURL(file));
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
			//window.open('data:text/csv;charset=utf-8,' + escape(docText), 'results.csv');
		},

		enableQuery: function(e) {
		if(e.currentTarget.dataset.unlock === "yes") {
		    $(".sqls-query", sqlsearchwp.context).prop("disabled", false);
		    e.currentTarget.dataset.unlock = "no";
			e.currentTarget.innerHTML = 'Lock';
			$(".sqls-lock", sqlsearchwp.context).prop("style", "display: none;");
		}
		else {
		    $(".sqls-query", sqlsearchwp.context).prop("disabled", true);
		    e.currentTarget.dataset.unlock = "yes";
			e.currentTarget.innerHTML='Unlock';
			$(".sqls-lock", sqlsearchwp.context).prop("style", "");
		}
	        },

		/**
		 *@summary Update the inner html of the query textarea with what the user enters
		 *
		 *@param Object e Event Object
		 **/
		doQueryUpdate: function(e) {
		
                   var textValue = e.target.value;
		   $(".sqls-query", sqlsearchwp.context).innerHTML = textValue;
		   sqlsearchwp.targets.dr14.data.Query = textValue;
		   sqlsearchwp.targets.dr14Secondary.data.Query = textValue;

	        },
		
		/**
		 * @summary Submits form data to target db
		 * 
		 * @param Object e Event Object
		**/
		doSubmit: function( e ) {
			console.log(sqlsearchwp.context);
			
			// Get target db from form data
		
			//var display = $( sqlsearchwp.context ).data('sqls-display');
			//var _query = e.currentTarget.dataset.sqlsSubmitto +
			//encodeURI( $( '#sqls-query' ).val() );
			$(".sqls-hour", sqlsearchwp.context).prop("style", "");
			var query = e.data.target.data.Query;
			var target = e.data.target;
			var which = e.data.which;

			if ( which === 'dr14' || which === 'dr14Secondary') {
			    target.data = {"Query":query};
			    $.ajax( target );
			    
			}
			else {
			    
			    //send query from form to skyserverws and listen for return
			    var xhttp;
			    xhttp = new XMLHttpRequest();
			    xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
				    var response = this.responseText;
				    response = response.replace(/.*<body.*?>/i , "");
				    response = response.replace(/<\/body.*/i , "");

				    sqlsearchwp.showResults( response , false , true, true );
					sqlsearchwp.showForm( '' , true , false );
				}
			    };
			    xhttp.open("GET", query , true);
			    xhttp.send();
			}
			
			/*if ( display === 'div' && false) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						response = response.replace(/.*<body.*?>/i , "");
						response = response.replace(/<\/body.*//*i , "");
						sqlsearchwp.showResults( response , false , true );
						sqlsearchwp.showForm( '' , true , false );
					}
				};
				xhttp.open("GET", _query , true);
				xhttp.send();
			} else if ( display === 'iframe' && false) {
				sqlsearchwp.showResults( '' , false , true);
				$('#sqls-results').append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="sqls-iframe" id="sqls-iframe"></iframe></div>');
				sqlsearchwp.showForm( '' , true , false );
			} else {
				console.log( "Display type not supported: " + display + "." );
			}*/
			
		},
		
		/**
		 * @summary Sends form data to skyserverws for syntax review
		 * 
		 * @param Object e Event Object
		**/
		doSyntax: function( e ) {
			//if (SQLSDEBUG) { console.log('doSyntax'); }
			$(".sqls-hour", sqlsearchwp.context).prop("style", "");
			// Get target db from form data
			var display = $( sqlsearchwp.context ).data('sqls-display');
			var _query = e.currentTarget.dataset.sqlsSubmitto +
				encodeURI( $(".sqls-query", sqlsearchwp.context).val() );

			if ( display === 'div' ) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						sqlsearchwp.showResults( response , false , true, false );
					}
				};
				xhttp.open("GET", _query, true);
				xhttp.send();
				
			} else if ( display === 'iframe' ) {
				
			    sqlsearchwp.showResults( '' , false , true, false);
				$(sqlsearchwp.context + " .sqls-results").append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="sqls-iframe" id="sqls-iframe-' + sqlsearchwp.identity + '"></iframe></div>');
				sqlsearchwp.showForm( '' , true , false );
				
			} else {
				
				console.log( "Display type not supported: " + display + "." );
				
			}
		},
		
		/**
		 * @summary Resets form data
		 * 
		 * @param Object e Event Object
		**/
		doReset: function( e ) {
			// Reset query - don't do this while testing...
			sqlsearchwp.showResults( '<pre>Results Empty!\n\n<strong>Check Syntax</strong> or <strong>Submit</strong> to get results</pre>' , false , false, false, false );
			sqlsearchwp.showForm( sqlsearchwp.context , false , true );
		},
		
		doCollapse: function( toggle, container, show ) {
			$('.collapse').collapse();
			if ( show === true ) {
				$(container).collapse('show');
			} else {
				$(container).collapse('hide');
			}
		},
		
		showInstructions: function( instructions ) {
			var instContainer = $(".sqls-instructions", sqlsearchwp.context);
			var instWrapper = $(".sqls-instructions-wrap", sqlsearchwp.context);
			var which = $( sqlsearchwp.context ).data('sqls-which');

			var xhttp;
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					var response = this.responseText;
					$( instContainer ).html(response);
				}
			};
			xhttp.open("GET", instructions + 'instructions-' + which + '.txt' , true);
			xhttp.send();
		},
		
		showForm: function( context , append , show ) {
			var toggle = $('.sqls-form-wrap>h2>a[data-toggle]', sqlsearchwp.context);
			var container = $(".sqls-form-wrap", sqlsearchwp.context);
			if (SQLSDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			//var _query = sqlsearchwp.query[ $( context ).data('sqls-which') ];
			
			//$( '#sqls-query' ).prop( 'value' , sqlsearchwp.query[ $( context ).data('sqls-which') ] );
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		showResults: function( results , append , show, format, newWin ) {
			if(format) {
				sessionStorage.setItem('queryResults' + sqlsearchwp.identity, results);
				$(".sqls-download", sqlsearchwp.context).prop("style", "");
			} else {
				$(".sqls-download", sqlsearchwp.context).prop("style", "display:none;");
			}
			var container = $(".sqls-results", sqlsearchwp.context);

			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			contents += ( results !== undefined ) ? results : '' ;
			if (format) {
			    contents = sqlsearchwp.formatResults(contents);
			} 
			$(".sqls-hour", sqlsearchwp.context).prop("style", "display: none;");
			$(container).html(contents);
			if (newWin) {
				sqlsearchwp.openWindow(contents);
			}
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-results-wrap>h2>a[data-toggle]', $(".sqls-results-outer", sqlsearchwp.context), show );
		},

		formatResults: function(data) {
		        var output = '<pre><table class="table-bordered table-responsive">';
		        var lines = data.split('\n');
			for(var i = 0; i < lines.length - 1; i++) {
			    output += '<tr>';
			    var items = lines[i].split(',');
			    var symbolBegin = '<td>';
			    var symbolEnd = '</td>';
			    if (i === 0) {
				symbolBegin = '<th>';
				symbolEnd = '</th>';
			    }
			    for (var x = 0; x < items.length; x++) {
				output += symbolBegin;
				output += items[x];
				output += symbolEnd;
			    }
			    output += '</tr>';
			}
			output += '</table></pre>';
			//output += '<div class="clearfix"></div><div class="row"><div class="col-xs-12 col-sm-12 col-md-12 text-center"><button id="sqls-download" name="sqls-download" class ="sqls-download btn btn-primary btn-dr14">Download</button></div></div>';
			return output;
			
	        }
	};

	$(document).ready( function(  ) {
		var divs = document.getElementsByClassName("sqls-wrap");
		for(var i = 0; i < divs.length; i++) {
			//console.log(divs[i].id);
			//if($(divs[i].id).length === 1) {
				var id = '#' + divs[i].id;
				sqlsearchwp.init(id);
				//sqlsearchwp.init(id);
				//console.log(id);
			//}
			/*else {
				if (SQLSDEBUG) { console.log('Error running sqlsearchwp.js. One and only one "#' + divs[i].id + '" expected.');}
			}*/
		}
		//if ( $( '#' + php_vars.context ).length === 1 ) {
			//sqlsearchwp.init(  );
		//} else {
			//if (SQLSDEBUG) { console.log('Error running sqlsearchwp.js. One and only one "#sqls-container" expected.');}
		//}
	} );
	
})(jQuery);