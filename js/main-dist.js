"use strict";

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
		return "\n\t\t\t<h1 class=\"pretty\">About this app</h1>\n\t\t\t<p>\n\t\t\t\tThis web application provides a probability calculator for various distribution types. Start by selecting the desired distribution type from the side bar, then enter appropriate values into the table and press \"Compute Probability\" to get the corresponding probability value.\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\tThis page was coded by Grant Sander. Mathematical content written by Neil Hatfield. Built upon jStat, MathJax and JSXGraph.\n\t\t\t</p>\n\t\t";
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
				$("#cpf-binomial-calculation").html("\n\t\t\t\t\t<p class=\"red\">Invalid Input</p>\n\t\t\t\t");
			};
		});
	},

	description: {
		title: "Binomial Distribution",
		body: "\n\t\t\t\"A binomial situation is any situation that involves a binomial stochastic process.  Specifically, the stochastic process must relate to sequence of Bernoulli trials and the stochastic variable of interest is the count of \"successes\" in a fixed (and known) number of trials (represented by <i>X</i>). <br/><br/> The cumulative probability function (CPF, a.k.a. CDF) for a binomial situation is \\[ C_B\\left(x|n,p\\right)=\\sum_{i=0}^x\\left(\\frac{n!}{i!(n-i)!}p^j(1-p)^{(n-i)}\\times\\Delta i\\right)\\] where the parameter <i>n</i> is the total number of Bernoulli trials, the parameter <i>p</i> is the probability of \"success\", and the input <i>x</i> is the maximum number of successes we want to observe in the <i>n</i> trials. Since <i>X</i> is a discrete stochastic variable, $\\Delta i$ always equals one. The Rate of Change function (probability mass function) is defined as \\[ B\\left(x|n,p\\right)=\\frac{n!}{x!(n-x)!}p^{x}(1-p)^{(n-p)}.\\] When a stochastic variable follows a binomial distribution, we will write $X\\sim\\mathcal{Bin}(n,p)$.\"\n\t\t"
	}
};
statcalc.distributions["cpf-discrete-uniform"] = {
	render: function render() {
		return "\n\t\t\t<h1 class='pretty'>Discrete Uniform Distribution</h1>\n\n\t\t\t<table class='input-table' align='center'>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Number of Unique Events ($N$) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-discrete-uniform-n' placeholder='n' value='6'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-discrete-uniform-l' placeholder='Lower Limit' value='1'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Upper Limit (Max Num. of Successes) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-discrete-uniform-u' placeholder='Upper Limit' value='3'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t\t<button type='button' id='cpf-discrete-uniform-compute' class='compute'>Compute Probability</button>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\n\t\t\t<h4>The Cumulative Probability of [Upper Limit] or a smaller value:</h4>\n\t\t\t<div id='cpf-discrete-uniform-calculation' class='calculation'></div>\n\n\t\t\t<div id='cpf-discrete-uniform-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-discrete-uniform-compute").on("click", function () {

			try {

				// Get values
				var a = math.eval($("#cpf-discrete-uniform-l").val()),
				    b = math.eval($("#cpf-discrete-uniform-u").val()),
				    n = math.eval($("#cpf-discrete-uniform-n").val());
				// Do a little validation
				if (a < 0 || b < 0 || b < a) {
					throw "Improper bounds";
				}

				// Generate some html
				var HTMLout = "\n\t\t\t    \t\\[ \\sum_{i= " + a + " }^{ " + b + " } \\left( \\frac{1}{ " + n + " } \\times \\Delta i \\right) = " + (1 / n * (b - a + 1)).toFixed(statcalc.decimals) + " \\]\n\t\t\t    ";
				$("#cpf-discrete-uniform-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// JSXgraph stuff
				$("#cpf-discrete-uniform-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-discrete-uniform-board', {
					boundingbox: [-0.2, 1.2, Math.max(n, b) + 1, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return Math.floor(x) * (Math.floor(x) + 1) / (2 * n);
				}, 0, 12], statcalc.jsxg.properties.functiongraph);
				// Points with labels
				board.create("point", [a, Math.floor(a) * (Math.floor(a) + 1) / (2 * n)], statcalc.jsxg.properties.point);
				board.create("text", [a, Math.floor(a) * (Math.floor(a) + 1) / (2 * n), "(" + a + ", <i>C<sub>DU</sub></i>(" + a + "|" + b + ", " + n + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
				board.create("point", [b, Math.floor(b) * (Math.floor(b) + 1) / (2 * n)], statcalc.jsxg.properties.point);
				board.create("text", [b, Math.floor(b) * (Math.floor(b) + 1) / (2 * n), "(" + b + ", <i>C<sub>DU</sub></i>(" + b + "|" + b + ", " + n + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
			} catch (err) {
				$("#cpf-discrete-uniform-calculation").html("\n\t\t\t\t\t<p class=\"red\">Invalid Input</p>\n\t\t\t\t");
			}
		});
	},

	description: {
		title: "Discrete Uniform Distribution",
		body: "\n    \tSituations that we describe as \"discrete uniform situations\" differ from others in that the moment we specify all of the possible outcomes of the stochastic process, we automatically get the probability of any single outcome.  This comes from the fact that in these situations we will always assume that the stochastic process is \"fair\", meaning that each outcome has the same probability of occurring as any other outcome. The stochastic variable of interest is a discrete numeric value. <br/><br/> The cumulative probability function (CPF/CDF) for a discrete uniform situation is $$C_{DU}\\left(x|N\\right)=\\sum^x_{i=i}\\left(\\frac{1}{N}\\times\\Delta i\\right)$$ where the parameter <i>N</i> is the total number of different outcomes of the process and $\\Delta i$ is the change between any two adjacent values; we fix the value of $\\Delta i=1$. Notice that the summation starts at 1 rather than 0; <i>i</i> is the index of the outcomes rather than the value of the stochastic variable (i.e. 1 is the first outcome, 2 is the second outcome, etc.).  The Rate of Change function (probability mass function) is defined as $$DU\\left(x|N\\right)=\\frac{1}{N}.$$ When a stochastic variable follows a discrete uniform distribution, we will write $X\\sim\\mathcal{DU}(N)$.\n\n\t\t"
	}
};
statcalc.distributions["cpf-poisson"] = {
	render: function render() {
		return "\n\t\t\t<h1 class='pretty'>Poisson Distribution</h1>\n\n\t\t\t<table class='input-table' align='center'>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Expected Number of \"Events\" Given size/duration ($\\lambda$) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-poisson-n' placeholder='n' value='1.5'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-poisson-l' placeholder='Lower Limit' value='1'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Upper Limit (Max Num. of Successes) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-poisson-u' placeholder='Upper Limit' value='4'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t\t<button type='button' id='cpf-poisson-compute' class='compute'>Compute Probability</button>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\n\t\t\t<h4>The Cumulative Probability of [Upper Limit] or fewer occurances:</h4>\n\t\t\t<div id='cpf-poisson-calculation' class='calculation'></div>\n\n\t\t\t<div id='cpf-poisson-board' class='board'></div>\n\t\t";
	},

	register: function register() {

		$("#cpf-poisson-compute").on("click", function () {
			try {

				var a = math.eval($("#cpf-poisson-l").val()),
				    b = math.eval($("#cpf-poisson-u").val()),
				    n = math.eval($("#cpf-poisson-n").val());
				// Do a little validation
				if (a < 0 || b < 0 || b < a) {
					throw "Improper bounds";
				}

				// Compute some values
				var cdf_a = jStat.poisson.cdf(a, n),
				    cdf_b = jStat.poisson.cdf(b, n),
				    cdf_diff = jStat.poisson.cdf(b, n) - jStat.poisson.cdf(a - 1, n);

				// Generate HTML
				var HTMLout = "\n        \t\t\t\\[ \\sum_{i= " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{e^{ " + chopDecimals(n, 3) + " } " + chopDecimals(n, 3) + " ^{i}} {i!} = " + cdf_diff.toFixed(statcalc.decimals) + " \\]\n        \t\t";
				$("#cpf-poisson-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// JSXGraph stuff
				$("#cpf-poisson-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-poisson-board', {
					boundingbox: [-b / 5, 1.2, 2 * n + 4, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.poisson.cdf(x, n);
				}, 0], statcalc.jsxg.properties.functiongraph);

				// Points with labels
				board.create("point", [a, jStat.poisson.cdf(a, n)], statcalc.jsxg.properties.point);
				board.create("text", [a, jStat.poisson.cdf(a, n), "(" + a + ", <i>C<sub>Poi</sub></i>(" + a + "|" + n + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
				board.create("point", [b, jStat.poisson.cdf(b, n)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.poisson.cdf(b, n), "(" + b + ", <i>C<sub>Poi</sub></i>(" + b + "|" + n + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
			} catch (err) {
				$("#cpf-poisson-calculation").html("\n\t\t\t\t\t<p class=\"red\">Invalid Input</p>\n\t\t\t\t");
			}
		});
	},

	description: {
		title: "Poisson Distribution",
		body: "\n    \tA Poisson situation is closely related to a binomial situation and is useful in biology. Recall that for binomial situations, we typically imagine repeating a sequence of <i>n</i> trials. We fix the value of <i>n</i> and assume that this value is \"small-ish\" and does not change.  Suppose that we imagine that the number of trials is unbounded (i.e. each sequence contains an unlimited number of trials). This is the first step in imagining of Poisson situation. Poisson situations often occur when we are studying a phenomenon where we are \"waiting\" for the occurrence of some event.  Here \"waiting\" does not automatically refer to the passage of time; we also use \"waiting\" to refer to passage through space (e.g. moving through a forest, field, desert) or looking through some broader setting (e.g. looking through the words printed on a page for typos). The stochastic variable of interest <i>X</i> represents the number of times we saw that event while we were \"waiting\". Since this is a count, we are still dealing with a discrete stochastic variable.</br></br>The cumulative probability function (CPF/CDF) for a Poisson situation is $$C_{Poi}\\left(x|\\lambda\\right)=\\sum^{x}_{i=0}\\left(\\frac{e^{-\\lambda}\\lambda^{i}}{i!}\\times\\Delta i\\right)$$ where the parameter $\\lambda$ is the expected number of \"successes\" per a given unit (e.g. how many successes we expect to see given we \"wait\" 500 words, or 100 meters, or 10 minutes). In a Poisson situation, you are typically given the value of $\\lambda$ (or told an estimate). (As is usual for Discrete Situations, we assume that $\\Delta i=1$.) The Rate of Change function (probability mass function) is defined as $$Poi\\left(x|\\lambda\\right)=\\frac{e^{-\\lambda}\\lambda^x}{x!}.$$ Examples of Poisson situations include the number of phone calls in a minute to a call center, locations of a particular species within a particular area, and the number of errors found on a printed page.When a stochastic variable follows a Poisson distribution, we will write $X\\sim\\mathcal{Poi}(\\lambda)$.\n\n\t\t"
	}
};
statcalc.distributions["cpf-continuous-uniform"] = {
	render: function render() {
		return "\n\t\t<h1 class='pretty'>Continuous Uniform Distribution</h1>\n\n\t\t<table class='input-table' align='center'>\n\t\t\t<tr>\n\t\t\t\t<td> Lower Limit of Interval ($a$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-continuous-uniform-aInt' placeholder='Lower Limit (Interval)' value='0'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Upper Limit of Interval ($b$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-continuous-uniform-bInt' placeholder='Upper Limit (Interval)' value='1'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Lower Limit of Accumulation </td>\n\t\t\t\t<td> <input type='text' id='cpf-continuous-uniform-aAccum' placeholder='Lower Limit (Accum.)' value='0.1'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Upper Limit of Accumulation </td>\n\t\t\t\t<td> <input type='text' id='cpf-continuous-uniform-bAccum' placeholder='Upper Limit (Accum.)' value='0.34'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t<button type='button' id='cpf-continuous-uniform-compute' class='compute'>Compute Probability</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\n\t\t<h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>\n\t\t<div id='cpf-continuous-uniform-calculation' class='calculation'></div>\n\n\t\t<div id='cpf-continuous-uniform-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-continuous-uniform-compute").on("click", function () {
			try {

				var aInt = math.eval($("#cpf-continuous-uniform-aInt").val()),
				    bInt = math.eval($("#cpf-continuous-uniform-bInt").val()),
				    aAccum = math.eval($("#cpf-continuous-uniform-aAccum").val()),
				    bAccum = math.eval($("#cpf-continuous-uniform-bAccum").val());

				// Some cases -- THIS NEEDS SOME WORK...
				var HTMLout;
				if (bAccum < aInt) {
					HTMLout = 'Cumulative Probability equals 0: the end of accumulation occurs before the start of the interval of the uniform distribution.';
				} else if (aAccum > bInt) {
					HTMLout = 'Cumulative Probability equals 0: the start of accumulation occurs after the end of the uniform distribution.';
				} else if (aAccum <= aInt && bAccum >= aInt) {
					HTMLout = "\n\t\t          \\[\\frac{( " + chopDecimals(Math.min(bAccum, bInt), 3) + " )-( " + chopDecimals(aInt, 3) + " )} {( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aInt, 3) + " )} = " + ((Math.min(bAccum, bInt) - aInt) / (bInt - aInt)).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else if (aAccum >= aInt && bAccum <= bInt) {
					HTMLout = "\n\t\t          \\[\\frac{( " + chopDecimals(bAccum, 3) + " )-( " + chopDecimals(aAccum, 3) + " )} {( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aInt, 3) + " )} = " + ((bAccum - aAccum) / (bInt - aInt)).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else if (aAccum <= bInt && bAccum >= bInt) {
					HTMLout = "\n\t\t          \\[\\frac{( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aAccum, 3) + " )} {( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aInt, 3) + " )}= " + ((bInt - aAccum) / (bInt - aInt)).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else if (aAccum <= aInt && bAccum >= bInt) {
					HTMLout = "\n\t\t          \\[\\frac{( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aInt, 3) + " )} {( " + chopDecimals(bInt, 3) + " )-( " + chopDecimals(aInt, 3) + " )} = 1 \\]\n\t\t          ";
				} else {
					throw "Invalid input";
				}

				$("#cpf-continuous-uniform-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				$("#cpf-continuous-uniform-board").css({
					width: "450px",
					height: "350px"
				});
				var intWidth = bInt - aInt;
				var board = JXG.JSXGraph.initBoard('cpf-continuous-uniform-board', {
					boundingbox: [Math.min(aInt, aAccum) - 0.5 * intWidth, 1.2, Math.max(bInt, bAccum) + 0.5 * intWidth, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				var cpf_continuous_uniform_f = function cpf_continuous_uniform_f(x, aInt, bInt) {
					if (x < aInt) {
						return 0;
					} else if (x > bInt) {
						return 1;
					} else {
						return 1 / (bInt - aInt) * (x - aInt);
					}
				};

				board.create("functiongraph", [function (x) {
					return cpf_continuous_uniform_f(x, aInt, bInt);
				}], statcalc.jsxg.properties.functiongraph);

				// Points with labels
				board.create("point", [aAccum, cpf_continuous_uniform_f(aAccum, aInt, bInt)], statcalc.jsxg.properties.point);
				board.create("text", [aAccum, cpf_continuous_uniform_f(aAccum, aInt, bInt), "$(" + aAccum + ", C_{CU}(" + aAccum + "|" + aInt + "," + bInt + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
				board.create("point", [bAccum, cpf_continuous_uniform_f(bAccum, aInt, bInt)], statcalc.jsxg.properties.point);
				board.create("text", [bAccum, cpf_continuous_uniform_f(bAccum, aInt, bInt), "$(" + bAccum + ", C_{CU}(" + bAccum + "|" + aInt + "," + bInt + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
			} catch (err) {
				$("#cpf-continuous-uniform-calculation").html("\n\t\t\t\t\t<p class=\"red\">Invalid Input</p>\n\t\t\t\t");
			}
		});
	},

	description: {
		title: "Continuous Uniform Distribution",
		body: "\n    \tContinuous Uniform situations are much like Discrete Uniform situations. However, there are two important differences.  First, in the Continuous Uniform situation, the stochastic variable of interest may take on any conceivable value in a given interval.  If the given interval is $[0,10]$, then we could observe (ignoring measurement errors) an object which has the value of $\\pi$ or $\\sqrt[2]{2}$ in addition to values like 3 and 7.5. The second way that a Continuous Uniform situation is different from a Discrete Uniform situation is in what we assume is \"fair\" (i.e. the same) for all values of the stochastic variable.  In the Continuous Uniform situation, we will assume that there is a <i>Constant Rate of Change</i> function (PDF) defined as $$CU\\left(x|a,b\\right)=\\begin{cases}\\frac{1}{b-a}&\\text{ if }a\\leq x\\leq b\\\\0&\\text{ otherwise.}\\end{cases}$$ where the parameter <i>a</i> is the smallest possible value that the stochastic variable may take on and the parameter <i>b</i> is the largest possible value.<br/><br/> The cumulative probability function (CPF/CDF) for a Continuous Uniform situation is given by $$C_{CU}\\left(x|a,b\\right)=\\begin{cases} 0 & \\text{ if } x &lt; a \\\\ \\frac{x-a}{b-a}&\\text{ if } a\\leq x\\leq b\\\\1&\\text{ if } x &gt; b.\\end{cases}$$ When a stochastic variable follows a continuous distribution, we will write $X\\sim\\mathcal{Uni}(a,b)$.\n\n\t\t"
	}
};
statcalc.distributions["cpf-normal-gaussian"] = {
	render: function render() {
		return "\n\t\t<h1 class='pretty'>Normal (Gaussian) Distribution</h1>\n\n\t\t\t<table class='input-table' align='center'>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Expected Value ($\\mu$) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-normal-gaussian-m' placeholder='Expected Value' value='0'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Variance ($\\sigma^2$) </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-normal-gaussian-sv' placeholder='Variance' value='1'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-normal-gaussian-a' placeholder='Lower Limit' value='-1'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td> Upper Limit </td>\n\t\t\t\t\t<td> <input type='text' id='cpf-normal-gaussian-b' placeholder='Upper Limit' value='2'/> </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t\t<button type='button' id='cpf-normal-gaussian-compute' class='compute'>Compute Probability</button>\n\t\t\t\t\t</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\n\t\t<h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>\n\t\t<div id='cpf-normal-gaussian-calculation' class='calculation'></div>\n\n\t\t<div id='cpf-normal-gaussian-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-normal-gaussian-compute").on("click", function () {
			try {

				var a = $("#cpf-normal-gaussian-a").val();
				a = a == "-oo" ? "-oo" : math.eval(a);
				var b = math.eval($("#cpf-normal-gaussian-b").val());
				var m = math.eval($("#cpf-normal-gaussian-m").val());
				var sv = math.eval($("#cpf-normal-gaussian-sv").val());
				var std = parseFloat(Math.sqrt(sv));

				if (b < a) {
					throw "Improper bounds";
				}

				// Generate output
				if (a == '-oo') {
					var HTMLout = "\n\t\t          \\[ \\int\\limits_{-\\infty}^{ " + chopDecimals(b, 3) + " } \\frac{1}{\\sqrt{2\\pi \\cdot " + chopDecimals(sv, 3) + " ^2}} e^{\\frac{-(t- " + chopDecimals(m, 3) + " )^2}{2\\cdot " + chopDecimals(sv, 3) + " }} dt = " + jStat.normal.cdf(b, m, std).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else {
					var HTMLout = "\n\t\t            \\[ \\int\\limits_{ " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{1}{\\sqrt{2\\pi \\cdot " + chopDecimals(sv, 3) + " }} e^{\\frac{-(t- " + chopDecimals(m, 3) + " )^2}{2\\cdot " + chopDecimals(sv, 3) + " }} dt =  " + (jStat.normal.cdf(b, m, std) - jStat.normal.cdf(a, m, std)).toFixed(statcalc.decimals) + " \\]\n\t\t            ";
				}

				$("#cpf-normal-gaussian-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				$("#cpf-normal-gaussian-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-normal-gaussian-board', {
					boundingbox: [m - 5 * std, 1.2, m + 5 * std, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.normal.cdf(x, m, std);
				}], statcalc.jsxg.properties.functiongraph);
				// Points with labels
				if (a != "-oo") {
					board.create("point", [a, jStat.normal.cdf(a, m, std)], statcalc.jsxg.properties.point);
					board.create("text", [a, jStat.normal.cdf(a, m, std), "(" + a + ", <i>C<sub>N</sub></i>(" + a + "|" + m + ", " + std + "))"], {
						fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
					});
				}

				board.create("point", [b, jStat.normal.cdf(b, m, std)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.normal.cdf(b, m, std), "(" + b + ", <i>C<sub>N</sub></i>(" + b + "|" + m + ", " + std + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
			} catch (err) {
				$("#cpf-normal-gaussian-calculation").html("<p class='red'>Invalid Input</p>");
			}
		});
	},

	description: {
		title: "Normal (Gaussian) Distribution",
		body: "\n    \tWhen we are dealing with whole (entire) populations that include individuals of any type (e.g. we don't separate out by another stochastic variable; looking at just members with XX chromosomes) and the stochastic variable of interest is continuous, then we could be dealing with a normal situation. (The term \"normal\" does not imply that this is the \"standard\" type of situation or that every other situation is \"abnormal\"; the term \"normal\" comes from set of equations and approach the built the mathematical theory behind this type of situation. Mathematician C. F. Gauss introduced this type of distribution; hence the alternative name, Gaussian.) Normal situations (distributions) are some of the most well-studied situations and stochastic processes. Due to this, normal situations are often the easiest to work with mathematically and easy for people to think about and visualize.  In fact, in more complex settings, we can \"standardize\"/\"normalize\" the stochastic variable so that we can make use of the niceties of normal situations.</br></br>The Rate of Change (PDF) function for normal situations is defined as $$N\\left(x|\\mu,\\sigma^2\\right)=\\frac{1}{\\sqrt[2]{2\\pi\\sigma^2}}\\text{exp}\\left(-\\frac{\\left(x-\\mu\\right)^2}{2\\sigma^2}\\right)$$ where $\\mu$ is the expected value of the stochastic variable and the parameter $\\sigma^2$ is the variance of the stochastic variable.  The behavior of the stochastic variable matters greatly in normal situations. Unlike the continuous uniform situation where the stochastic variable's value is bounded, we assume that the stochastic variable's value in a normal situation is completely unbounded. (That is to say that we imagine (or in theory) the stochastic variable could take on any real number as a value; what we imagine or say in theory is not necessarily the same as in practice.) The expression \"$\\text{exp}\\left(a\\right)$\" is the same as writing \"$e^{a}$\".</br></br>The cumulative probability function (CPF/CDF) for a normal situation is defined as $$C_N\\left(x|\\mu,\\sigma^2\\right)=\\int_{-\\infty}^xN\\left(t|\\mu,\\sigma^2\\right)\\cdot dt$$<br><br>A \"Standard Normal Distribution\" is a special case of the Normal (Gaussian) distribution. Consider a stochastic variable, <i>X</i> which we know follows a Normal distribution with a known expected value of $\\mu$ and a known value of variance of $\\sigma^2$; written as $X\\sim\\mathcal{N}\\left(\\mu,\\sigma^2\\right)$. If we transform all of the observations of <i>X</i> by first subtracting the expected value and then dividing by the square root of the variance, we would get a new set of values; specifically define $z_i$ as $$z_i=\\frac{x_i-\\mu}{\\sqrt[2]{\\sigma^2}}$$ This transformation is called \"standardization\". The stochastic variable <i>Z</i>, a.k.a. the \"Standardized form of <i>X</i>\" follows a \"Standard Normal Distribution\" with expected value of 0 and a variance value of 1; $Z\\sim\\mathcal{N}\\left(0,1\\right)$.\n\n\t\t"
	}
};
statcalc.distributions["cpf-student-t"] = {
	render: function render() {
		return "\n\t\t<h1 class='pretty'>(A.) Student's $t$ Distribution</h1>\n\n\t\t<table class='input-table' align='center'>\n\t\t\t<tr>\n\t\t\t\t<td> Degrees of Freedom ($\\nu$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-student-t-DoF' placeholder='Expected Value' value='1'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t<td> <input type='text' id='cpf-student-t-a' placeholder='Lower Limit' value='0'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Upper Limit </td>\n\t\t\t\t<td> <input type='text' id='cpf-student-t-b' placeholder='Upper Limit' value='1.376'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t<button type='button' id='cpf-student-t-compute' class='compute'>Compute Probability</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\n\t\t<h4>The Cumulative Probability of [Upper Limit] or smaller value</h4>\n\t\t<div id='cpf-student-t-calculation' class='calculation'></div>\n\n\t\t<div id='cpf-student-t-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-student-t-compute").on("click", function () {
			try {

				var a = $("#cpf-student-t-a").val();
				a = a == "-oo" ? "-oo" : math.eval(a);
				var b = math.eval($("#cpf-student-t-b").val());
				var DoF = math.eval($("#cpf-student-t-DoF").val());

				if (a != "-oo" && b < a) {
					throw "Improper bounds";
				}
				// Generate output
				var HTMLout = "";
				if (a == "-oo") {
					HTMLout = "\n          \t\t\t\\[ \\int\\limits_{-\\infty}^{ " + chopDecimals(b, 3) + " } \\frac{ \\Gamma \\left( \\frac{ " + DoF + " +1}{2}\\right)}{\\Gamma \\left( \\frac{ " + DoF + " }{2}\\right)} \\cdot \\frac{1}{\\sqrt{ " + DoF + " \\cdot \\pi}} \\cdot \\frac{1}{\\left( 1+ \\left( \\frac{t^2}{ " + DoF + " }\\right) \\right)^{( " + DoF + " +1)/2}} \\, dt = " + jStat.studentt.cdf(b, DoF).toFixed(statcalc.decimals) + " \\]\n\n\t\t        \t";
				} else {
					HTMLout = "\n          \t\t\t\\[ \\int\\limits_{ " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{ \\Gamma \\left( \\frac{ " + DoF + " +1}{2}\\right)}{\\Gamma \\left( \\frac{ " + DoF + " }{2}\\right)} \\cdot \\frac{1}{\\sqrt{ " + DoF + " \\cdot \\pi}} \\cdot \\frac{1}{\\left( 1+ \\left( \\frac{t^2}{ " + DoF + " }\\right) \\right)^{( " + DoF + " +1)/2}} \\, dt = " + (jStat.studentt.cdf(b, DoF) - jStat.studentt.cdf(a, DoF)).toFixed(statcalc.decimals) + " \\]\n\n\t\t        \t";
				}

				$("#cpf-student-t-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				$("#cpf-student-t-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-student-t-board', {
					boundingbox: [Math.min(a, -7) - 2, 1.2, Math.max(b, 7) + 2, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.studentt.cdf(x, DoF);
				}], statcalc.jsxg.properties.functiongraph);
				// Points with labels
				if (a != "-oo") {
					board.create("point", [a, jStat.studentt.cdf(a, DoF)], statcalc.jsxg.properties.point);
					board.create("text", [a, jStat.studentt.cdf(a, DoF), "(" + a + ", <i>C<sub>t</sub></i>(" + a + "|" + DoF + "))"], {
						fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
					});
				}

				board.create("point", [b, jStat.studentt.cdf(b, DoF)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.studentt.cdf(b, DoF), "(" + b + ", <i>C<sub>t</sub></i>(" + b + "|" + DoF + "))"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16
				});
			} catch (err) {
				$("#cpf-student-t-calculation").html("<p class='red'>Invalid Input</p>");
			}
		});
	},

	description: {
		title: "(A.) Student's $t$ Distribution",
		body: "\n      \tThe (A.) Student's <i>t</i> distribution is named after the pseudonym \"A. Student\". The original developer was William Gosset, a statistician employed by the Guinness brewery, which had a policy where employee's could not publish their work. The underlying situation for Student's <i>t</i> is very similar to that of Normal situations. However, there are two important differences: the sample size is small and we do not know the value of the population variance. In the case of the first difference (small sample size), we no longer have access to the entire population as we do in the Normal (Gaussian) setting. For the second difference, we know that there is a value for the population variance, we just don't have a solid grip on that value. To use Student's <i>t</i>, we will assume that observed values in our data collection follow a Normal (Gaussian) distribution if we had access to the entire population. <br><br>The Rate of Change function (PDF) for Student's <i>t</i> is defined as $$t\\left(x|\\nu\\right)=\\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt[2]{\\nu\\pi}\\;\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}\\left(1+\\frac{x^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$$ where $\\nu$ is the degrees of freedom (the size of the sample less the number of parameters we've estimated; in this case $\\nu=n-1$) and the \"Gamma\" ( $\\Gamma$ ) function. <br><br>The cumulative probability function  (CPF/CDF) for a Student's <i>t</i> is defined as $$C_t\\left(x|\\nu\\right)=\\int_{-\\infty}^xt\\left(u|\\nu\\right)\\cdot du$$ When a stochastic variable follows a Student's <i>t</i> distribution, we will write $X\\sim t(\\nu)$.\n\n\t\t"
	}
};
statcalc.distributions["cpf-chi-squared"] = {
	render: function render() {
		return "\n\t\t<h1 class='pretty'>Chi-Squared ($\\chi^2$) Distribution</h1>\n\n\t\t<table class='input-table' align='center'>\n\t\t\t<tr>\n\t\t\t\t<td> Degrees of Freedom ($\\nu$) </td>\n\t\t\t\t<td> <input type='text' id='cpf-chi-squared-DoF' placeholder='Expected Value' value='1'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Lower Limit </td>\n\t\t\t\t<td> <input type='text' id='cpf-chi-squared-a' placeholder='Lower Limit' value='0'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td> Upper Limit </td>\n\t\t\t\t<td> <input type='text' id='cpf-chi-squared-b' placeholder='Upper Limit' value='1.5'/> </td>\n\t\t\t</tr>\n\t\t\t<tr>\n\t\t\t\t<td colspan='2' class='text-center'>\n\t\t\t\t\t<button type='button' id='cpf-chi-squared-compute' class='compute'>Compute Probability</button>\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>\n\n\t\t<h4>The Cumulative Probability of [Upper Limit] or smaller value</h4>\n\t\t<div id='cpf-chi-squared-calculation' class='calculation'></div>\n\n\t\t<div id='cpf-chi-squared-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-chi-squared-compute").on("click", function () {
			try {

				var a = $("#cpf-chi-squared-a").val();
				a = a == "-oo" ? "-oo" : math.eval(a);
				var b = math.eval($("#cpf-chi-squared-b").val());
				var DoF = math.eval($("#cpf-chi-squared-DoF").val());

				// A little validation
				if (a != "-oo" && b < a) {
					throw "Improper bounds";
				}

				// Generate output
				var HTMLout = "";
				if (a == "-oo") {
					HTMLout = "\n          \t\t\t\\[ \\int\\limits_{-\\infty}^{ " + chopDecimals(b, 3) + " } \\frac{1}{\\Gamma \\left(\\frac{ " + DoF + " }{2} \\right) \\cdot 2^{ " + DoF + " /2}} \\cdot t^{( " + DoF + " /2)-1} e^{-t/2} \\, dt = " + jStat.chisquare.cdf(b, DoF).toFixed(statcalc.decimals) + " \\]\n\t\t        \t";
				} else if ((jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF)) && (jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF))) {
					HTMLout = "\n         \t\t\t\\[ \\int\\limits_{ " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{1}{\\Gamma \\left(\\frac{ " + DoF + " }{2} \\right) \\cdot 2^{ " + DoF + " /2}} \\cdot t^{( " + DoF + " /2)-1} e^{-t/2} \\, dt = " + (jStat.chisquare.cdf(b, DoF) - jStat.chisquare.cdf(a, DoF)).toFixed(statcalc.decimals) + " \\]\n\t\t        \t";
				} else {
					throw "Invalid Input";
				}

				$("#cpf-chi-squared-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// JSXG stuff
				$("#cpf-chi-squared-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-chi-squared-board', {
					boundingbox: [-1, 1.2, 1.5 * b, -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.chisquare.cdf(x, DoF);
				}], statcalc.jsxg.properties.functiongraph);
				// Points with labels
				if (a != "-oo") {
					board.create("point", [a, jStat.chisquare.cdf(a, DoF)], statcalc.jsxg.properties.point);
					board.create("text", [a, jStat.chisquare.cdf(a, DoF), "$(" + a + ", C_{\\\\chi^2}(" + a + "|" + DoF + "))$"], {
						fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
					});
				}

				board.create("point", [b, jStat.chisquare.cdf(b, DoF)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.chisquare.cdf(b, DoF), "$(" + b + ", C_{\\\\chi^2}(" + b + "|" + DoF + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
			} catch (err) {
				$("#cpf-chi-squared-calculation").html("<p class='red'>Invalid Input</p>");
			}
		});
	},

	description: {
		title: "Chi-Squared ($\\chi^2$) Distribution",
		body: "\n\t\t<p>\n\t      The $\\chi^2$ distribution grew out of investigating the variance parameter of Normal distributions. We often use the $\\chi^2$ distribution (and the associated tests) when our research question is either\n\t    </p>\n\t    <ul>\n\t      <li>\n\t        \"Are these multiple groups actually different from each other?\" (Analysis of Variance-ANOVA, ANCOVA, MANOVA, MANCOVA)\n\t      </li>\n\t      <li>\n\t        \"How do we predict this stochastic variable using these other stochastic variables?\" (Regression-Estimating Slope Parameters)\n\t      </li>\n\t      <li>\n\t        \"Is stochastic variable A independent of stochastic variable B?\" (Test for Independence)\n\t      </li>\n\t      <li>\n\t        \"Given the data collection, are our data consistent with our theory?\" (Pearson's Goodness of Fit Test)\n\t      </li>\n\t    </ul>\n\t    <p>\n\t      The generation of a stochastic variable that has a $\\chi^2$ distribution is fairly straightforward. Starting with a normally distributed stochastic variable, say <i>X</i>, standardize <i>X</i> and then square that result. This result has a $\\chi^2$ distribution with one degree of freedom.\n\t    </p>\n\t    <p>\n\t      The degrees of freedom ($\\nu$) for $\\chi^2$ distributions depends on the situation and the test.\n\t    </p>\n\t    <ul>\n\t      <li>\n\t        If your situation involves adding up <i>m</i> independent of stochastic variables each of which have a $\\chi^2$ with one degree of freedom, then the sum has a $\\chi^2$ distribution with <i>m</i> degrees of freedom.\n\t      </li>\n\t      <li>\n\t        Testing Independence: the total number of observations has minimal impact on degrees of freedom, rather the number of categories for each stochastic variable is more important. If you build a two-way contingency table for your situation, the degrees of freedom will $(r-1)(c-1)$ where <i>r</i> is the number of rows and <i>c</i> the number of columns.\n\t      </li>\n\t      <li>\n\t        Goodness of Fit: here you want to check to see if your data is consistent with your theory. Your theory must include some specified distribution. If there are <i>k</i> possible values of the stochastic variable (from your theory), then your degrees of freedom is $k-1$. This is provided any parameters for your theory are specified. If you have any unspecified parameters, then you will reduce the degrees of freedom by 1 for each parameter you estimate. For example, if you estimate two parameters from the data, your actual degrees of freedom will be $k-1-2$.\n\t      </li>\n\t    </ul>\n\t    <p>\n\t      The Rate of Change function (PDF) for a $\\chi^2$ distribution with $\\nu$ degrees of freedom is defined as $$f\\left(x|\\nu\\right)=\\begin{cases}\\frac{x^{((\\nu/2)-1)}e^{-x/2}}{2^{\\nu/2}\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}&\\text{ if }x \\ge 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_{\\chi^2}\\left(x|\\nu\\right)=\\int_0^xf(t|\\nu)\\cdot dt$$ When a stochastic variable follows a $\\chi^2$ distribution with $\\nu$ degrees of freedom, we will write $X\\sim\\chi^2(\\nu)$\n\t    </p>\n\t\t"
	}
};
statcalc.distributions["cpf-f"] = {
	render: function render() {
		return "\n\t    <h1 class='pretty'>F Distribution</h1>\n\n\t    <table class='input-table' align='center'>\n\t      <tr>\n\t        <td> Degrees of Freedom (Numerator, $\\nu_1$) </td>\n\t        <td> <input type='text' id='cpf-f-DoF1' placeholder='DoF (numerator)' value='2'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Degrees of Freedom (Denominator, $\\nu_2$) </td>\n\t        <td> <input type='text' id='cpf-f-DoF2' placeholder='DoF (denominator)' value='4'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Lower Limit </td>\n\t        <td> <input type='text' id='cpf-f-a' placeholder='Lower Limit' value='0'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Upper Limit </td>\n\t        <td> <input type='text' id='cpf-f-b' placeholder='Upper Limit' value='3'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td colspan='2' class='text-center'>\n\t          <button type='button' id='cpf-f-compute' class='compute'>Compute Probability</button>\n\t        </td>\n\t      </tr>\n\t    </table>\n\n\t    <h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>\n\t    <div id='cpf-f-calculation' class='calculation'></div>\n\n\t    <div id='cpf-f-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-f-compute").on("click", function () {
			try {

				var a = $("#cpf-f-a").val();
				a = a == "-oo" ? "-oo" : math.eval(a);
				var b = math.eval($("#cpf-f-b").val());
				var DoF1 = math.eval($("#cpf-f-DoF1").val());
				var DoF2 = math.eval($("#cpf-f-DoF2").val());
				// Do some validation on the values
				if (a != "-oo" && b < a) {
					throw "Improper bounds";
				}

				// # Generate some output
				var HTMLout;
				if (a == "-oo") {
					HTMLout = "\n\t\t          \\[ \\int\\limits_{-\\infty}^{ " + chopDecimals(b, 3) + " } \\frac{ \\Gamma \\left( \\frac{ " + DoF1 + " + " + DoF2 + " }{2}\\right)} {\\Gamma \\left( \\frac{ " + DoF1 + " }{2}\\right) \\Gamma \\left( \\frac{ " + DoF2 + " }{2} \\right) } \\left( \\frac{ " + DoF1 + " }{ " + DoF2 + " }\\right)^{ " + DoF1 + " /2} \\frac{t^{( " + DoF1 + " -2)/2}}{ \\left( 1 + \\left(\\frac{ " + DoF1 + " }{ " + DoF2 + " }\\right) t \\right)^{( " + DoF1 + " + " + DoF2 + " )/2}} \\, dt = " + jStat.centralF.cdf(b, DoF1, DoF2).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else if ((jStat.centralF.cdf(a, DoF1, DoF2) == 0 || jStat.centralF.cdf(a, DoF1, DoF2)) && (jStat.centralF.cdf(b, DoF1, DoF2) == 0 || jStat.centralF.cdf(b, DoF1, DoF2))) {
					HTMLout = "\n\t\t          \\[ \\int\\limits_{ " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{ \\Gamma \\left( \\frac{ " + DoF1 + " + " + DoF2 + " }{2}\\right) } {\\Gamma \\left( \\frac{ " + DoF1 + " }{2}\\right) \\Gamma \\left( \\frac{ " + DoF2 + " }{2} \\right) } \\left( \\frac{ " + DoF1 + " }{ " + DoF2 + " }\\right)^{ " + DoF1 + " /2} \\frac{t^{( " + DoF1 + " -2)/2}}{ \\left( 1 + \\left(\\frac{ " + DoF1 + " }{ " + DoF2 + " }\\right) t \\right)^{( " + DoF1 + " + " + DoF2 + " )/2}} \\, dt = " + (jStat.centralF.cdf(b, DoF1, DoF2) - jStat.centralF.cdf(a, DoF1, DoF2)).toFixed(statcalc.decimals) + " \\]\n\t\t          ";
				} else {
					throw "Invalid Input";
				}

				$("#cpf-f-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// # JSXGraph stuff....
				$("#cpf-f-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-f-board', {
					boundingbox: [-Math.max(10, b + 1) / 10, 1.2, Math.max(10, b + 1), -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.centralF.cdf(x, DoF1, DoF2);
				}], statcalc.jsxg.properties.functiongraph);
				// # Points with labels
				if (a != "-oo") {
					board.create("point", [a, jStat.centralF.cdf(a, DoF1, DoF2)], statcalc.jsxg.properties.point);
					board.create("text", [a, jStat.centralF.cdf(a, DoF1, DoF2), "$(" + a + ", C_{F}(" + a + "|" + DoF1 + ", " + DoF2 + "))$"], {
						fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
					});
				}
				board.create("point", [b, jStat.centralF.cdf(b, DoF1, DoF2)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.centralF.cdf(b, DoF1, DoF2), "$(" + b + ", C_{F}(" + b + "|" + DoF1 + ", " + DoF2 + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
			} catch (err) {
				$("#cpf-f-calculation").html("<p class='red'>Invalid Input</p>");
			}
		});
	},

	description: {
		title: "F Distribution",
		body: "\n    \tThe (Central) F distribution (more formally, Snedecor's <i>F</i> distribution) is very useful in answering the some of the same sorts of questions as the $\\chi^2$ distribution. In particular, we use the <i>F</i> to answer questions about multiple groups being different (Analysis of Variance) and prediction (Regression-Model level). In essence, when we form the ratio of two independent sums of squares, we are essentially looking at a new stochastic variable (the ratio) that follows the <i>F</i> distribution. For formally, if $X\\sim\\chi^2(a)$ (<i>X</i> has a $\\chi^2$ distribution with <i>a</i> degrees of freedom), $Y\\sim\\chi^2(b)$ (<i>Y</i> has a $\\chi^2$ distribution with <i>b</i> degrees of freedom), and <i>X</i> and <i>Y</i> are independent of each other, then when we define $W=\\frac{X/a}{Y/b}$ we say that <i>W</i> has an <i>F</i> distribution with degrees of freedom <i>a</i> and <i>b</i>. Notice that the two necessary parameters for the <i>F</i> distribution are the two degrees of freedom from the two $\\chi^2$ distributed stochastic variables.</br></br>The Rate of Change function (PDF) for an <i>F</i> distribution with $\\nu_1$ and $\\nu_2$ degrees of freedom is defined as $$g\\left(x|\\nu_1,\\nu_2\\right)=\\begin{cases}\\frac{\\Gamma\\left(\\frac{\\nu_1+\\nu_2}{2}\\right)}{\\Gamma\\left(\\frac{\\nu_1}{2}\\right)\\Gamma\\left(\\frac{\\nu_2}{2}\\right)}\\cdot\\left(\\frac{\\nu_1}{\\nu_2}\\right)^{\\nu_1/2}\\cdot\\frac{x^{\\frac{\\nu_1-2}{2}}}{\\left(1+\\left(\\frac{\\nu_1}{\\nu_2}\\right)x\\right)^{(\\nu_1+\\nu_2)/2}}&\\text{ if }x &gt; 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_F\\left(X|\\nu_1,\\nu_2\\right)=\\int_0^xg\\left(t|\\nu_1,\\nu_2\\right)\\cdot dt$$When a stochastic variable follows a <i>F</i> distribution, we will write $X\\sim F(\\nu_1,\\nu_2)$.\n\t\t"
	}
};
statcalc.distributions["cpf-lognormal"] = {
	render: function render() {
		return "\n\t    <h1 class='pretty'>Log-normal Distribution</h1>\n\n\t    <table class='input-table' align='center'>\n\t      <tr>\n\t        <td> Location ($\\mu$) </td>\n\t        <td> <input type='text' id='cpf-lognormal-mu' placeholder='Location' value='1'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Shape ($\\sigma$) </td>\n\t        <td> <input type='text' id='cpf-lognormal-sigma' placeholder='Shape' value='2'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Lower Limit </td>\n\t        <td> <input type='text' id='cpf-lognormal-a' placeholder='Lower Limit' value='10'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td> Upper Limit </td>\n\t        <td> <input type='text' id='cpf-lognormal-b' placeholder='Upper Limit' value='20'/> </td>\n\t      </tr>\n\t      <tr>\n\t        <td colspan='2' class='text-center'>\n\t          <button type='button' id='cpf-lognormal-compute' class='compute'>Compute Probability</button>\n\t        </td>\n\t      </tr>\n\t    </table>\n\n\t    <h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>\n\t    <div id='cpf-lognormal-calculation' class='calculation'></div>\n\n\t    <div id='cpf-lognormal-board' class='board'></div>\n\t\t";
	},

	register: function register() {
		$("#cpf-lognormal-compute").on("click", function () {
			try {

				// # Get values
				var a = math.eval($("#cpf-lognormal-a").val());
				var b = math.eval($("#cpf-lognormal-b").val());
				var mu = math.eval($("#cpf-lognormal-mu").val());;
				var sigma = math.eval($("#cpf-lognormal-sigma").val());
				// #Do some validation on the values
				if (a < 0 || b < 0 || b < a) {
					throw "Improper bounds";
				}
				// # Generate some output
				var HTMLout = "\n\t\t        \\[ \\int\\limits_{ " + chopDecimals(a, 3) + " }^{ " + chopDecimals(b, 3) + " } \\frac{1}{x\\cdot " + chopDecimals(sigma, 3) + " \\cdot \\sqrt{2\\pi }} \\exp\\left(-\\frac{(\\log t - " + chopDecimals(mu, 3) + " )^2}{2\\cdot " + chopDecimals(sigma, 3) + "^2}\\right) \\, dt = " + (jStat.lognormal.cdf(b, mu, sigma) - jStat.lognormal.cdf(a, mu, sigma)).toFixed(statcalc.decimals) + " \\]\n\t\t        ";
				$("#cpf-lognormal-calculation").html(HTMLout);
				MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

				// # JSXGraph stuff....
				$("#cpf-lognormal-board").css({
					width: "450px",
					height: "350px"
				});
				var board = JXG.JSXGraph.initBoard('cpf-lognormal-board', {
					boundingbox: [-Math.max(10, b + 1) / 10, 1.2, Math.max(10, b + 1), -0.2],
					axis: true,
					showNavigation: false,
					showCopyright: false
				});
				board.create("functiongraph", [function (x) {
					return jStat.lognormal.cdf(x, mu, sigma);
				}], statcalc.jsxg.properties.functiongraph);
				// #Points with labels
				board.create("point", [a, jStat.lognormal.cdf(a, mu, sigma)], statcalc.jsxg.properties.point);
				board.create("text", [a, jStat.lognormal.cdf(a, mu, sigma), "$(" + a + ", C_{\\\\log}(" + a + "|" + mu + ", " + sigma + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
				board.create("point", [b, jStat.lognormal.cdf(b, mu, sigma)], statcalc.jsxg.properties.point);
				board.create("text", [b, jStat.lognormal.cdf(b, mu, sigma), "$(" + b + ", C_{\\\\log}(" + b + "|" + mu + ", " + sigma + "))$"], {
					fixed: true, highlight: false, anchorX: "left", anchorY: "bottom", fontSize: 16, useMathJax: true
				});
			} catch (err) {
				$("#cpf-lognormal-calculation").html("<p class='red'>Invalid Input</p>");
			}
		});
	},

	description: {
		title: "Log-normal Distribution",
		body: "\n      \tThe Log-normal distribution (a.k.a. the Galton distribution) is closely related to the Normal (Gaussian) distribution. There are some important differences to keep in mind. First, for the Log-normal stochastic variable, we can only observe positive values (zero is not positive) where Normal stochastic variable allows for positive, negative and zero. Second, the stochastic process underlying the Log-normal distribution relates to multiplication and the examination of growth rates. Thus, the sample geometric mean is the better estimate of the location parameter ($\\mu$) than the sample arithmetic mean. If <i>X</i> has a Log-normal distribution and we define $Y=\\log\\left(X\\right)$, then <i>Y</i> has a Normal Distribution. Important to note is that \"log\" (\"common log\") is not $\\log_{10}$ as you would find in pre-calculus or calculus classes. Rather \"common log\" in Statistics is $\\log_{e}$ or ln. </br></br> The Rate of Change (PDF) function for Log-normal situations is defined as $$LN\\left(x|\\mu,\\sigma\\right)=\\frac{1}{x\\sigma\\sqrt[2]{2\\pi}}\\text{exp}\\left(-\\frac{\\left(\\log x-\\mu\\right)^2}{2(\\sigma)^2}\\right)$$ where $\\mu$ is the location parameter and $\\sigma$ is the shape parameter.</br></br>The cumulative probability function (CPF/CDF) for a Log-normal situation is defined as $$C_{LN}\\left(x|\\mu,\\sigma\\right)=\\int_0^xLN\\left(t|\\mu,\\sigma\\right)\\cdot dt$$ When a stochastic variable follows a log-normal distribution, we will write $X\\sim \\mathcal{LOGN}(\\mu,\\sigma)$.\n\n\t\t"
	}
};