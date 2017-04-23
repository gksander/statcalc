statcalc.distributions["cpf-student-t"] = {
	render: function(){
		return `
		<h1 class='pretty'>(A.) Student's $t$ Distribution</h1>

		<table class='input-table' align='center'>
			<tr>
				<td> Degrees of Freedom ($\\nu$) </td>
				<td> <input type='text' id='cpf-student-t-DoF' placeholder='Expected Value' value='1'/> </td>
			</tr>
			<tr>
				<td> Lower Limit </td>
				<td> <input type='text' id='cpf-student-t-a' placeholder='Lower Limit' value='0'/> </td>
			</tr>
			<tr>
				<td> Upper Limit </td>
				<td> <input type='text' id='cpf-student-t-b' placeholder='Upper Limit' value='1.376'/> </td>
			</tr>
			<tr>
				<td colspan='2' class='text-center'>
					<button type='button' id='cpf-student-t-compute' class='compute'>Compute Probability</button>
				</td>
			</tr>
		</table>

		<h4>The Cumulative Probability of [Upper Limit] or smaller value</h4>
		<div id='cpf-student-t-calculation' class='calculation'></div>

		<div id='cpf-student-t-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-student-t-compute").on("click", function(){
			try {

				var a = $("#cpf-student-t-a").val();
		        a = a=="-oo" ? "-oo" : math.eval(a);
		        var b = math.eval($("#cpf-student-t-b").val());
		        var DoF = math.eval($("#cpf-student-t-DoF").val());

		        if (a!="-oo" && b<a){
		        	throw "Improper bounds";
		        }
		        // Generate output
		        var HTMLout ="";
		        if (a=="-oo"){
		        	HTMLout = `
          			\\[ \\int\\limits_{-\\infty}^{ ${chopDecimals(b, 3)} } \\frac{ \\Gamma \\left( \\frac{ ${DoF} +1}{2}\\right)}{\\Gamma \\left( \\frac{ ${DoF} }{2}\\right)} \\cdot \\frac{1}{\\sqrt{ ${DoF} \\cdot \\pi}} \\cdot \\frac{1}{\\left( 1+ \\left( \\frac{t^2}{ ${DoF} }\\right) \\right)^{( ${DoF} +1)/2}} \\, dt = ${(jStat.studentt.cdf(b, DoF)).toFixed(statcalc.decimals)} \\]

		        	`;
		        } else {
		        	HTMLout = `
          			\\[ \\int\\limits_{ ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{ \\Gamma \\left( \\frac{ ${DoF} +1}{2}\\right)}{\\Gamma \\left( \\frac{ ${DoF} }{2}\\right)} \\cdot \\frac{1}{\\sqrt{ ${DoF} \\cdot \\pi}} \\cdot \\frac{1}{\\left( 1+ \\left( \\frac{t^2}{ ${DoF} }\\right) \\right)^{( ${DoF} +1)/2}} \\, dt = ${(jStat.studentt.cdf(b, DoF) - jStat.studentt.cdf(a, DoF)).toFixed(statcalc.decimals)} \\]

		        	`;
		        }

		        $("#cpf-student-t-calculation").html(HTMLout)
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		        $("#cpf-student-t-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-student-t-board', {
		          boundingbox: [Math.min(a, -7) - 2, 1.2, Math.max(b, 7) + 2, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        board.create("functiongraph", [
		          function(x){return jStat.studentt.cdf(x, DoF);}
		        ], statcalc.jsxg.properties.functiongraph);
		        // Points with labels
		        if (a != "-oo") {
		          board.create("point", [a, jStat.studentt.cdf(a, DoF)], statcalc.jsxg.properties.point)
		          board.create("text", [
		            a,
		            jStat.studentt.cdf(a, DoF),
		            "(" + a + ", <i>C<sub>t</sub></i>(" + a + "|" + DoF + "))"
		          ], {
		            fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		          });
			    }

		        board.create("point", [b, jStat.studentt.cdf(b, DoF)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          b,
		          jStat.studentt.cdf(b, DoF),
		          "(" + b + ", <i>C<sub>t</sub></i>(" + b + "|" + DoF + "))"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16
		        })

			} catch (err){
				$("#cpf-student-t-calculation").html(
		          "<p class='red'>Invalid Input</p>"
		        )
			}
		})
	},

	description: {
		title: "(A.) Student's $t$ Distribution",
		body: `
      	The (A.) Student's <i>t</i> distribution is named after the pseudonym "A. Student". The original developer was William Gosset, a statistician employed by the Guinness brewery, which had a policy where employee\'s could not publish their work. The underlying situation for Student\'s <i>t</i> is very similar to that of Normal situations. However, there are two important differences: the sample size is small and we do not know the value of the population variance. In the case of the first difference (small sample size), we no longer have access to the entire population as we do in the Normal (Gaussian) setting. For the second difference, we know that there is a value for the population variance, we just don\'t have a solid grip on that value. To use Student\'s <i>t</i>, we will assume that observed values in our data collection follow a Normal (Gaussian) distribution if we had access to the entire population. <br><br>The Rate of Change function (PDF) for Student\'s <i>t</i> is defined as $$t\\left(x|\\nu\\right)=\\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt[2]{\\nu\\pi}\\;\\cdot\\Gamma\\left(\\frac{\\nu}{2}\\right)}\\left(1+\\frac{x^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$$ where $\\nu$ is the degrees of freedom (the size of the sample less the number of parameters we\'ve estimated; in this case $\\nu=n-1$) and the "Gamma" ( $\\Gamma$ ) function. <br><br>The cumulative probability function  (CPF/CDF) for a Student\'s <i>t</i> is defined as $$C_t\\left(x|\\nu\\right)=\\int_{-\\infty}^xt\\left(u|\\nu\\right)\\cdot du$$ When a stochastic variable follows a Student\'s <i>t</i> distribution, we will write $X\\sim t(\\nu)$.

		`
	}
};