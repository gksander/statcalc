statcalc.distributions["cpf-f"] = {
	render: function(){
		return `
	    <h1 class='pretty'>F Distribution</h1>

	    <table class='input-table' align='center'>
	      <tr>
	        <td> Degrees of Freedom (Numerator, $\\nu_1$) </td>
	        <td> <input type='text' id='cpf-f-DoF1' placeholder='DoF (numerator)' value='2'/> </td>
	      </tr>
	      <tr>
	        <td> Degrees of Freedom (Denominator, $\\nu_2$) </td>
	        <td> <input type='text' id='cpf-f-DoF2' placeholder='DoF (denominator)' value='4'/> </td>
	      </tr>
	      <tr>
	        <td> Lower Limit </td>
	        <td> <input type='text' id='cpf-f-a' placeholder='Lower Limit' value='0'/> </td>
	      </tr>
	      <tr>
	        <td> Upper Limit </td>
	        <td> <input type='text' id='cpf-f-b' placeholder='Upper Limit' value='3'/> </td>
	      </tr>
	      <tr>
	        <td colspan='2' class='text-center'>
	          <button type='button' id='cpf-f-compute' class='compute'>Compute Probability</button>
	        </td>
	      </tr>
	    </table>

	    <h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>
	    <div id='cpf-f-calculation' class='calculation'></div>

	    <div id='cpf-f-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-f-compute").on("click", function(){
			try {

				var a = $("#cpf-f-a").val();
		        a = a=="-oo" ? "-oo" : math.eval(a);
		        var b = math.eval($("#cpf-f-b").val());
		        var DoF1 = math.eval($("#cpf-f-DoF1").val());
		        var DoF2 = math.eval($("#cpf-f-DoF2").val());
		        // Do some validation on the values
		        if ((a != "-oo") && (b < a)) {
		          throw "Improper bounds";
		        }

		        // # Generate some output
		        var HTMLout;
		        if (a == "-oo") {
		          HTMLout = `
		          \\[ \\int\\limits_{-\\infty}^{ ${chopDecimals(b, 3)} } \\frac{ \\Gamma \\left( \\frac{ ${DoF1} + ${DoF2} }{2}\\right)} {\\Gamma \\left( \\frac{ ${DoF1} }{2}\\right) \\Gamma \\left( \\frac{ ${DoF2} }{2} \\right) } \\left( \\frac{ ${DoF1} }{ ${DoF2} }\\right)^{ ${DoF1} /2} \\frac{t^{( ${DoF1} -2)/2}}{ \\left( 1 + \\left(\\frac{ ${DoF1} }{ ${DoF2} }\\right) t \\right)^{( ${DoF1} + ${DoF2} )/2}} \\, dt = ${(jStat.centralF.cdf(b, DoF1, DoF2)).toFixed(statcalc.decimals)} \\]
		          `;
		        }
		        else if ((jStat.centralF.cdf(a, DoF1, DoF2) == 0 || jStat.centralF.cdf(a, DoF1, DoF2)) && (jStat.centralF.cdf(b, DoF1, DoF2) == 0 || jStat.centralF.cdf(b, DoF1, DoF2))) {
		          HTMLout = `
		          \\[ \\int\\limits_{ ${chopDecimals(a, 3)} }^{ ${chopDecimals(b, 3)} } \\frac{ \\Gamma \\left( \\frac{ ${DoF1} + ${DoF2} }{2}\\right) } {\\Gamma \\left( \\frac{ ${DoF1} }{2}\\right) \\Gamma \\left( \\frac{ ${DoF2} }{2} \\right) } \\left( \\frac{ ${DoF1} }{ ${DoF2} }\\right)^{ ${DoF1} /2} \\frac{t^{( ${DoF1} -2)/2}}{ \\left( 1 + \\left(\\frac{ ${DoF1} }{ ${DoF2} }\\right) t \\right)^{( ${DoF1} + ${DoF2} )/2}} \\, dt = ${(jStat.centralF.cdf(b, DoF1, DoF2) - jStat.centralF.cdf(a, DoF1, DoF2)).toFixed(statcalc.decimals)} \\]
		          `;
		        }
		        else {
		          throw "Invalid Input"
		        }

		        $("#cpf-f-calculation").html(HTMLout)
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub])

		        // # JSXGraph stuff....
		        $("#cpf-f-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var board = JXG.JSXGraph.initBoard('cpf-f-board', {
		          boundingbox: [-Math.max(10, b + 1)/10, 1.2, Math.max(10, b + 1), -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        })
		        board.create("functiongraph", [
		          function(x){return jStat.centralF.cdf(x, DoF1, DoF2);}
		        ], statcalc.jsxg.properties.functiongraph);
		        // # Points with labels
		        if (a != "-oo") {
		          board.create("point", [a, jStat.centralF.cdf(a, DoF1, DoF2)], statcalc.jsxg.properties.point);
		          board.create("text", [
		            a,
		            jStat.centralF.cdf(a, DoF1, DoF2),
		            "$(" + a + ", C_{F}(" + a + "|" + DoF1 + ", " + DoF2 + "))$"
		          ], {
		            fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		          });
			    }
		        board.create("point", [b, jStat.centralF.cdf(b, DoF1, DoF2)], statcalc.jsxg.properties.point);
		        board.create("text", [
		          b,
		          jStat.centralF.cdf(b, DoF1, DoF2),
		          "$(" + b + ", C_{F}(" + b + "|" + DoF1 + ", " + DoF2 + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        });

			} catch(err){
				$("#cpf-f-calculation").html(
		          "<p class='red'>Invalid Input</p>"
		        )
			}
		});
	},

	description: {
		title: "F Distribution",
		body: `
    	The (Central) F distribution (more formally, Snedecor\'s <i>F</i> distribution) is very useful in answering the some of the same sorts of questions as the $\\chi^2$ distribution. In particular, we use the <i>F</i> to answer questions about multiple groups being different (Analysis of Variance) and prediction (Regression-Model level). In essence, when we form the ratio of two independent sums of squares, we are essentially looking at a new stochastic variable (the ratio) that follows the <i>F</i> distribution. For formally, if $X\\sim\\chi^2(a)$ (<i>X</i> has a $\\chi^2$ distribution with <i>a</i> degrees of freedom), $Y\\sim\\chi^2(b)$ (<i>Y</i> has a $\\chi^2$ distribution with <i>b</i> degrees of freedom), and <i>X</i> and <i>Y</i> are independent of each other, then when we define $W=\\frac{X/a}{Y/b}$ we say that <i>W</i> has an <i>F</i> distribution with degrees of freedom <i>a</i> and <i>b</i>. Notice that the two necessary parameters for the <i>F</i> distribution are the two degrees of freedom from the two $\\chi^2$ distributed stochastic variables.</br></br>The Rate of Change function (PDF) for an <i>F</i> distribution with $\\nu_1$ and $\\nu_2$ degrees of freedom is defined as $$g\\left(x|\\nu_1,\\nu_2\\right)=\\begin{cases}\\frac{\\Gamma\\left(\\frac{\\nu_1+\\nu_2}{2}\\right)}{\\Gamma\\left(\\frac{\\nu_1}{2}\\right)\\Gamma\\left(\\frac{\\nu_2}{2}\\right)}\\cdot\\left(\\frac{\\nu_1}{\\nu_2}\\right)^{\\nu_1/2}\\cdot\\frac{x^{\\frac{\\nu_1-2}{2}}}{\\left(1+\\left(\\frac{\\nu_1}{\\nu_2}\\right)x\\right)^{(\\nu_1+\\nu_2)/2}}&\\text{ if }x &gt; 0\\\\0&\\text{ otherwise.}\\end{cases}$$The cumulative probability function (CPF/CDF) is defined as $$C_F\\left(X|\\nu_1,\\nu_2\\right)=\\int_0^xg\\left(t|\\nu_1,\\nu_2\\right)\\cdot dt$$When a stochastic variable follows a <i>F</i> distribution, we will write $X\\sim F(\\nu_1,\\nu_2)$.
		`
	}
}