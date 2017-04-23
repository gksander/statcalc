statcalc.distributions["cpf-chi-squared"] = {
	render: function(){
		return `
		<h1 class='pretty'>Chi-Squared ($\\chi^2$) Distribution</h1>

		<table class='input-table' align='center'>
			<tr>
				<td> Degrees of Freedom ($\\nu$) </td>
				<td> <input type='text' id='cpf-chi-squared-DoF' placeholder='Expected Value' value='1'/> </td>
			</tr>
			<tr>
				<td> Lower Limit </td>
				<td> <input type='text' id='cpf-chi-squared-a' placeholder='Lower Limit' value='0'/> </td>
			</tr>
			<tr>
				<td> Upper Limit </td>
				<td> <input type='text' id='cpf-chi-squared-b' placeholder='Upper Limit' value='1.5'/> </td>
			</tr>
			<tr>
				<td colspan='2' class='text-center'>
					<button type='button' id='cpf-chi-squared-compute' class='compute'>Compute Probability</button>
				</td>
			</tr>
		</table>

		<h4>The Cumulative Probability of [Upper Limit] or smaller value</h4>
		<div id='cpf-chi-squared-calculation' class='calculation'></div>

		<div id='cpf-chi-squared-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-chi-squared-compute").on("click", function(){
			try {

				var a = $("#cpf-chi-squared-a").val();
		        a = a=="-oo" ? "-oo" : math.eval(a);
		        var b = math.eval($("#cpf-chi-squared-b").val());
		        var DoF = math.eval($("#cpf-chi-squared-DoF").val());

		        // A little validation
		        if (a!="-oo" && b<a){
		        	throw "Improper bounds";
		        }

		        // Generate output
		        var HTMLout = "";
		        if (a=="-oo") {
		        	HTMLout = `
          			\\[ \\int\\limits_{-\\infty}^{ ${chopDecimals(b, 3)} } \\frac{1}{\\Gamma \\left(\\frac{ ${DoF} }{2} \\right) \\cdot 2^{ ${DoF} /2}} \\cdot t^{( ${DoF} /2)-1} e^{-t/2} \\, dt = ${(jStat.chisquare.cdf(b, DoF)).toFixed(statcalc.decimals)} \\]
		        	`;
		        } else if ((jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF)) && (jStat.chisquare.cdf(a, DoF) == 0 || jStat.chisquare.cdf(a, DoF))) {
		        	HTMLout = `
         			\\[ \\int\\limits_{ ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{1}{\\Gamma \\left(\\frac{ ${DoF} }{2} \\right) \\cdot 2^{ ${DoF} /2}} \\cdot t^{( ${DoF} /2)-1} e^{-t/2} \\, dt = ${(jStat.chisquare.cdf(b, DoF) - jStat.chisquare.cdf(a, DoF)).toFixed(statcalc.decimals)} \\]
		        	`;
		        } else {
		        	throw "Invalid Input";
		        }

		        $("#cpf-chi-squared-calculation").html(HTMLout)
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        // JSXG stuff
		        $("#cpf-chi-squared-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-chi-squared-board', {
		          boundingbox: [-1, 1.2, 1.5 * b, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        board.create("functiongraph", [
		          function(x){return jStat.chisquare.cdf(x, DoF);}
		        ], statcalc.jsxg.properties.functiongraph);
		        // Points with labels
		        if (a != "-oo") {
		          board.create("point", [a, jStat.chisquare.cdf(a, DoF)], statcalc.jsxg.properties.point);
		          board.create("text", [
		            a,
		            jStat.chisquare.cdf(a, DoF),
		            "$(" + a + ", C_{\\\\chi^2}(" + a + "|" + DoF + "))$"
		          ], {
		            fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		          });
		        }
		        
		        board.create("point", [b, jStat.chisquare.cdf(b, DoF)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          b,
		          jStat.chisquare.cdf(b, DoF),
		          "$(" + b + ", C_{\\\\chi^2}(" + b + "|" + DoF + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        });


			} catch(err){
				$("#cpf-chi-squared-calculation").html(
		          "<p class='red'>Invalid Input</p>"
		        )
			}
		});
	},

	description: {
		title: "Chi-Squared ($\\chi^2$) Distribution",
		body: `
		<p>
	      The $\\chi^2$ distribution grew out of investigating the variance parameter of Normal distributions. We often use the $\\chi^2$ distribution (and the associated tests) when our research question is either
	    </p>
	    <ul>
	      <li>
	        "Are these multiple groups actually different from each other?" (Analysis of Variance-ANOVA, ANCOVA, MANOVA, MANCOVA)
	      </li>
	      <li>
	        "How do we predict this stochastic variable using these other stochastic variables?" (Regression-Estimating Slope Parameters)
	      </li>
	      <li>
	        "Is stochastic variable A independent of stochastic variable B?" (Test for Independence)
	      </li>
	      <li>
	        "Given the data collection, are our data consistent with our theory?" (Pearson\'s Goodness of Fit Test)
	      </li>
	    </ul>
	    <p>
	      The generation of a stochastic variable that has a $\\chi^2$ distribution is fairly straightforward. Starting with a normally distributed stochastic variable, say <i>X</i>, standardize <i>X</i> and then square that result. This result has a $\\chi^2$ distribution with one degree of freedom.
	    </p>
	    <p>
	      The degrees of freedom ($\\nu$) for $\\chi^2$ distributions depends on the situation and the test.
	    </p>
	    <ul>
	      <li>
	        If your situation involves adding up <i>m</i> independent of stochastic variables each of which have a $\\chi^2$ with one degree of freedom, then the sum has a $\\chi^2$ distribution with <i>m</i> degrees of freedom.
	      </li>
	      <li>
	        Testing Independence: the total number of observations has minimal impact on degrees of freedom, rather the number of categories for each stochastic variable is more important. If you build a two-way contingency table for your situation, the degrees of freedom will $(r-1)(c-1)$ where <i>r</i> is the number of rows and <i>c</i> the number of columns.
	      </li>
	      <li>
	        Goodness of Fit: here you want to check to see if your data is consistent with your theory. Your theory must include some specified distribution. If there are <i>k</i> possible values of the stochastic variable (from your theory), then your degrees of freedom is $k-1$. This is provided any parameters for your theory are specified. If you have any unspecified parameters, then you will reduce the degrees of freedom by 1 for each parameter you estimate. For example, if you estimate two parameters from the data, your actual degrees of freedom will be $k-1-2$.
	      </li>
	    </ul>
	    <p>
	      The Rate of Change function (PDF) for a $\\chi^2$ distribution with $\\nu$ degrees of freedom is defined as $$f\\left(x|\\nu\\right)=\\begin{cases}\\frac{x^{((\\nu/2)-1)}e^{-x/2}}{2^{\\nu/2}\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}&\\text{ if }x \\ge 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_{\\chi^2}\\left(x|\\nu\\right)=\\int_0^xf(t|\\nu)\\cdot dt$$ When a stochastic variable follows a $\\chi^2$ distribution with $\\nu$ degrees of freedom, we will write $X\\sim\\chi^2(\\nu)$
	    </p>
		`
	}
};