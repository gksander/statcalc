statcalc.distributions["cpf-normal-gaussian"] = {
	render: function(){
		return `
		<h1 class='pretty'>Normal (Gaussian) Distribution</h1>

			<table class='input-table' align='center'>
				<tr>
					<td> Expected Value ($\\mu$) </td>
					<td> <input type='text' id='cpf-normal-gaussian-m' placeholder='Expected Value' value='0'/> </td>
				</tr>
				<tr>
					<td> Variance ($\\sigma^2$) </td>
					<td> <input type='text' id='cpf-normal-gaussian-sv' placeholder='Variance' value='1'/> </td>
				</tr>
				<tr>
					<td> Lower Limit </td>
					<td> <input type='text' id='cpf-normal-gaussian-a' placeholder='Lower Limit' value='-1'/> </td>
				</tr>
				<tr>
					<td> Upper Limit </td>
					<td> <input type='text' id='cpf-normal-gaussian-b' placeholder='Upper Limit' value='2'/> </td>
				</tr>
				<tr>
					<td colspan='2' class='text-center'>
						<button type='button' id='cpf-normal-gaussian-compute' class='compute'>Compute Probability</button>
					</td>
				</tr>
			</table>

		<h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>
		<div id='cpf-normal-gaussian-calculation' class='calculation'></div>

		<div id='cpf-normal-gaussian-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-normal-gaussian-compute").on("click", function(){
			try {

				var a = $("#cpf-normal-gaussian-a").val();
		        a = a=="-oo" ? "-oo" : math.eval(a);
		        var b = math.eval($("#cpf-normal-gaussian-b").val());
		        var m = math.eval($("#cpf-normal-gaussian-m").val());
		        var sv = math.eval($("#cpf-normal-gaussian-sv").val());
		        var std = parseFloat(Math.sqrt(sv));

		        if (b < a){
		        	throw "Improper bounds";
		        }

		        // Generate output
		        if (a == '-oo') {
		          var HTMLout = `
		          \\[ \\int\\limits_{-\\infty}^{ ${chopDecimals(b, 3)} } \\frac{1}{\\sqrt{2\\pi \\cdot ${chopDecimals(sv, 3)} ^2}} e^{\\frac{-(t- ${chopDecimals(m, 3)} )^2}{2\\cdot ${chopDecimals(sv, 3)} }} dt = ${(jStat.normal.cdf(b, m, std)).toFixed(statcalc.decimals)} \\]
		          `
		      	}
		        else {
		            var HTMLout = `
		            \\[ \\int\\limits_{ ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{1}{\\sqrt{2\\pi \\cdot ${chopDecimals(sv, 3)} }} e^{\\frac{-(t- ${chopDecimals(m, 3)} )^2}{2\\cdot ${chopDecimals(sv, 3)} }} dt =  ${(jStat.normal.cdf(b, m, std) - jStat.normal.cdf(a, m, std)).toFixed(statcalc.decimals)} \\]
		            `
		        }

		        $("#cpf-normal-gaussian-calculation").html(HTMLout)
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        $("#cpf-normal-gaussian-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-normal-gaussian-board', {
		          boundingbox: [m - 5*std, 1.2, m + 5*std, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        board.create("functiongraph", [
		          function(x){return jStat.normal.cdf(x, m, std);}
		        ], statcalc.jsxg.properties.functiongraph);
		        // Points with labels
		        if (a != "-oo") {
		          board.create("point", [a, jStat.normal.cdf(a, m, std)], statcalc.jsxg.properties.point)
		          board.create("text", [
		            a,
		            jStat.normal.cdf(a, m, std),
		            "(" + a + ", <i>C<sub>N</sub></i>(" + a + "|" + m + ", " + std + "))"
		          ], {
		            fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		          });
			    }

		        board.create("point", [b, jStat.normal.cdf(b, m, std)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          b,
		          jStat.normal.cdf(b, m, std),
		          "(" + b + ", <i>C<sub>N</sub></i>(" + b + "|" + m + ", " + std + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        });



			} catch (err){
				$("#cpf-normal-gaussian-calculation").html(
		          "<p class='red'>Invalid Input</p>"
		        )
			}
		});
	},

	description: {
		title: "Normal (Gaussian) Distribution",
		body: `
    	When we are dealing with whole (entire) populations that include individuals of any type (e.g. we don\'t separate out by another stochastic variable; looking at just members with XX chromosomes) and the stochastic variable of interest is continuous, then we could be dealing with a normal situation. (The term "normal" does not imply that this is the "standard" type of situation or that every other situation is "abnormal"; the term "normal" comes from set of equations and approach the built the mathematical theory behind this type of situation. Mathematician C. F. Gauss introduced this type of distribution; hence the alternative name, Gaussian.) Normal situations (distributions) are some of the most well-studied situations and stochastic processes. Due to this, normal situations are often the easiest to work with mathematically and easy for people to think about and visualize.  In fact, in more complex settings, we can "standardize"/"normalize" the stochastic variable so that we can make use of the niceties of normal situations.</br></br>The Rate of Change (PDF) function for normal situations is defined as $$N\\left(x|\\mu,\\sigma^2\\right)=\\frac{1}{\\sqrt[2]{2\\pi\\sigma^2}}\\text{exp}\\left(-\\frac{\\left(x-\\mu\\right)^2}{2\\sigma^2}\\right)$$ where $\\mu$ is the expected value of the stochastic variable and the parameter $\\sigma^2$ is the variance of the stochastic variable.  The behavior of the stochastic variable matters greatly in normal situations. Unlike the continuous uniform situation where the stochastic variable\'s value is bounded, we assume that the stochastic variable\'s value in a normal situation is completely unbounded. (That is to say that we imagine (or in theory) the stochastic variable could take on any real number as a value; what we imagine or say in theory is not necessarily the same as in practice.) The expression "$\\text{exp}\\left(a\\right)$" is the same as writing "$e^{a}$".</br></br>The cumulative probability function (CPF/CDF) for a normal situation is defined as $$C_N\\left(x|\\mu,\\sigma^2\\right)=\\int_{-\\infty}^xN\\left(t|\\mu,\\sigma^2\\right)\\cdot dt$$<br><br>A "Standard Normal Distribution" is a special case of the Normal (Gaussian) distribution. Consider a stochastic variable, <i>X</i> which we know follows a Normal distribution with a known expected value of $\\mu$ and a known value of variance of $\\sigma^2$; written as $X\\sim\\mathcal{N}\\left(\\mu,\\sigma^2\\right)$. If we transform all of the observations of <i>X</i> by first subtracting the expected value and then dividing by the square root of the variance, we would get a new set of values; specifically define $z_i$ as $$z_i=\\frac{x_i-\\mu}{\\sqrt[2]{\\sigma^2}}$$ This transformation is called "standardization". The stochastic variable <i>Z</i>, a.k.a. the "Standardized form of <i>X</i>" follows a "Standard Normal Distribution" with expected value of 0 and a variance value of 1; $Z\\sim\\mathcal{N}\\left(0,1\\right)$.

		`
	}
};