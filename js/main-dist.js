"use strict";

/*  PREPROS APPENDS */
//@PREPROS-APPEND pages/about.js
//@PREPROS-APPEND distributions/cpf-binomial.js


$(document).ready(function () {
	// On document-ready

	// Pull hash and change to that content
	(function () {
		var hash = location.hash.substr(1);
		hash = hash == "" ? "about" : hash;
		statcalc.changeContent(hash);
	})();

	$(window).on("hashchange", function () {
		var hash = location.hash.substr(1);
		statcalc.changeContent(hash);
	});

	$(".hamburger-container").on("click", function () {
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
statcalc.changeContent = function (content) {

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
	} else if (statcalc.pages[content]) {
		$("#content").html(statcalc.pages[content].render());
	} else {
		$("#content").html("<p>Something went wrong...</p>");
	}
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

	// Check to see if description needs to be hidden or not
	if ($("#description-title").text() == "") {
		$("#description").addClass("hidden");
	} else {
		$("#description").removeClass("hidden");
	}
};

// Function to chop decimals
var chopDecimals = function chopDecimals(x, N) {
	if (x * Math.pow(10, N) % 1 == 0) {
		return x;
	} else {
		return x.toFixed(N);
	}
};
statcalc.pages["about"] = {
	render: function render() {
		return "\n\t\t\t<p>\n\t\t\t\tThis web application provides a probability calculator for various distribution types. Start by selecting the desired distribution type from the side bar, then enter appropriate values into the table and press \"Compute Probability\" to get the corresponding probability value.\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\tThis page was coded by Grant Sander. Mathematical content written by Neil Hatfield. Built upon jStat, MathJax and JSXGraph.\n\t\t\t</p>\n\t\t";
	}
};
statcalc.distributions["cpf-binomial"] = {
	render: function render() {
		return "\n\t\t<h1 class='pretty'>Binomial Distribution</h1>\n\n\t\t<table class='input-table' align='center'>\n\t\t\t<tr>\n\t\t\t\t<td> Number of Trials ($n$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-binomial-n' placeholder='n' value='8'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Probability of \"Success\" ($p$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-binomial-p' placeholder='p' value='0.6'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t<td> <input type='text' id='cpf-binomial-l' placeholder='Lower Limit' value='2'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Upper Limit (Max Num. of Successes) </td>\n\t\t\t\t<td> <input type='text' id='cpf-binomial-u' placeholder='Upper Limit' value='5'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t<button type='button' id='cpf-binomial-compute' class='compute'>Compute Probability</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\n\t\t<h4>The Cumulative Probability of [Upper Limit] or fewer Successes:</h4>\n\t\t<div id='cpf-binomial-calculation' class='calculation'></div>\n\n\t\t<div id='cpf-binomial-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-binomial-compute").on("click", function () {
			try {

				// Get Value
				var a = math.eval($("#cpf-binomial-l").val()),
				    b = math.eval($("#cpf-binomial-u").val()),
				    p = math.eval($("#cpf-binomial-p").val()),
				    n = math.eval($("#cpf-binomial-n").val());
				// Validation
				if (a < 0 || b < 0 || b < a) {
					throw "Improper bounds";
				}
				// Compute some bounds
				var cdf_a = jStat.binomial.cdf(a - 1, n, p),
				    cdf_b = jStat.binomial.cdf(b, n, p);

				var HTMLout = "\n\t\t\t    \t\\[ \\sum_{i= " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " }\n\t\t\t    \t\\frac{ " + n + " !}{i!\\left( " + n + " -i\\right)!} " + chopDecimals(p, 3) + " ^i ( " + chopDecimals(1 - p, 3) + " )^{ " + chopDecimals(n, 3) + " -i} = " + (cdf_b - cdf_a).toFixed(statcalc.decimals) + " \\]\n\t\t\t    ";

				$("#cpf-binomial-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// JSXGraph stuff....
				$("#cpf-binomial-board").css({
					width: "450px",
					height: "350px"
				});

				var board = JXG.JSXGraph.initBoard('cpf-binomial-board', {
					boundingbox: [-1, 1.3, n + 2, -0.3],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.binomial.cdf(x, n, p);
				}, 0, n], statcalc.jsxg.properties.functiongraph);
				// Points with labels
				board.create("point", [a, jStat.binomial.cdf(a, n, p)], statcalc.jsxg.properties.point);
				board.create("text", [a, jStat.binomial.cdf(a, n, p), "(" + a + ", C<sub>B</sub>(" + a + "|" + n + ", " + p + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
				board.create("point", [b, jStat.binomial.cdf(b, n, p)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.binomial.cdf(b, n, p), "(" + b + ", C<sub>B</sub>(" + b + "|" + n + ", " + p + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
			} catch (err) {
				console.log(err);
			};
		});
	},

	description: {
		title: "Binomial Distribution",
		body: "\n\t\t\t\"A binomial situation is any situation that involves a binomial stochastic process.  Specifically, the stochastic process must relate to sequence of Bernoulli trials and the stochastic variable of interest is the count of \"successes\" in a fixed (and known) number of trials (represented by <i>X</i>). <br/><br/> The cumulative probability function (CPF, a.k.a. CDF) for a binomial situation is \\[ C_B\\left(x|n,p\\right)=\\sum_{i=0}^x\\left(\\frac{n!}{i!(n-i)!}p^j(1-p)^{(n-i)}\\times\\Delta i\\right)\\] where the parameter <i>n</i> is the total number of Bernoulli trials, the parameter <i>p</i> is the probability of \"success\", and the input <i>x</i> is the maximum number of successes we want to observe in the <i>n</i> trials. Since <i>X</i> is a discrete stochastic variable, $\\Delta i$ always equals one. The Rate of Change function (probability mass function) is defined as \\[ B\\left(x|n,p\\right)=\\frac{n!}{x!(n-x)!}p^{x}(1-p)^{(n-p)}.\\] When a stochastic variable follows a binomial distribution, we will write $X\\sim\\mathcal{Bin}(n,p)$.\"\n\t\t"
	}
};