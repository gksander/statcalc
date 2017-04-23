/*  PREPROS APPENDS */
//@PREPROS-APPEND pages/about.js
//@PREPROS-APPEND distributions/cpf-binomial.js
//@PREPROS-APPEND distributions/cpf-discrete-uniform.js
//@PREPROS-APPEND distributions/cpf-poisson.js
//@PREPROS-APPEND distributions/cpf-continuous-uniform.js
//@PREPROS-APPEND distributions/cpf-normal-gaussian.js
//@PREPROS-APPEND distributions/cpf-student-t.js
//@PREPROS-APPEND distributions/cpf-chi-squared.js
//@PREPROS-APPEND distributions/cpf-f.js
//@PREPROS-APPEND distributions/cpf-lognormal.js


$(document).ready(function(){ // On document-ready

	// Pull hash and change to that content
	(function(){
		var hash = location.hash.substr(1);
		hash = hash=="" ? "about" : hash;
		statcalc.changeContent(hash);
	})();

	$(window).on("hashchange", function(){
		var hash = location.hash.substr(1);
		statcalc.changeContent(hash);
	});

	$(".hamburger-container").on("click", function(){
		$("body").toggleClass("side-bar-shown");
	});

}); // End document-ready




/* STATCALC OBJECT, JUST TO HOLD SOME PROPERTIES */
var statcalc = {
	distributions: {},
	pages: {},
	decimals: 6,
	jsxg: {
		properties: {
			functiongraph: {
				fixed: true,
				highlight: false,
				strokeWidth: 2,
				strokeColor: "blue"
			}, 
			point: {
				fixed: true,
				highlight: false,
				showInfobox: false,
				color: "black",
				name: "",
				size: 2
			}
		}
	}
};
// Change Content function
statcalc.changeContent = function(content){
	
	// Clear content
	$("#description-title, #description-body").empty();
	// Change active links
	$("a.active").removeClass("active");
	$("[href='#" + content + "']").addClass("active");
	// Check to see if content exists in statcalc.distributions, then statcalc.pages
	// Render content and register component listeners, load in descriptions
	if (statcalc.distributions[content]) {
		$("#content").html(statcalc.distributions[content].render());
		statcalc.distributions[content].register();

		if (statcalc.distributions[content].description) {
			$("#description-title").html(statcalc.distributions[content].description.title);
			$("#description-body").html(statcalc.distributions[content].description.body);
		}
	}
	else if (statcalc.pages[content]) {
		$("#content").html(statcalc.pages[content].render());
	}
	else {
		$("#content").html("<p>Something went wrong...</p>");
	}
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

	// Check to see if description needs to be hidden or not
	if ($("#description-title").text()=="") {
		$("#description").addClass("hidden");
	}
	else {
		$("#description").removeClass("hidden");
	}

};

// Function to chop decimals
var chopDecimals = function(x,N) {
	if (x*Math.pow(10,N) % 1 == 0) {return x;}
	else {return x.toFixed(N);}
}