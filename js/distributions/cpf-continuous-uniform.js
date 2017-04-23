statcalc.distributions["cpf-continuous-uniform"] = {
	render: function(){
		return `
		<h1 class='pretty'>Continuous Uniform Distribution</h1>

		<table class='input-table' align='center'>
			<tr>
				<td> Lower Limit of Interval ($a$) </td>
				<td> <input type='text' id='cpf-continuous-uniform-aInt' placeholder='Lower Limit (Interval)' value='0'/> </td>
			</tr>
			<tr>
				<td> Upper Limit of Interval ($b$) </td>
				<td> <input type='text' id='cpf-continuous-uniform-bInt' placeholder='Upper Limit (Interval)' value='1'/> </td>
			</tr>
			<tr>
				<td> Lower Limit of Accumulation </td>
				<td> <input type='text' id='cpf-continuous-uniform-aAccum' placeholder='Lower Limit (Accum.)' value='0.1'/> </td>
			</tr>
			<tr>
				<td> Upper Limit of Accumulation </td>
				<td> <input type='text' id='cpf-continuous-uniform-bAccum' placeholder='Upper Limit (Accum.)' value='0.34'/> </td>
			</tr>
			<tr>
				<td colspan='2' class='text-center'>
					<button type='button' id='cpf-continuous-uniform-compute' class='compute'>Compute Probability</button>
				</td>
			</tr>
		</table>

		<h4>The Cumulative Probability of [Upper Limit] or smaller value:</h4>
		<div id='cpf-continuous-uniform-calculation' class='calculation'></div>

		<div id='cpf-continuous-uniform-board' class='board'></div>
		`;
	},

	register: function(){
		$("#cpf-continuous-uniform-compute").on("click", function(){
			try {

				var aInt = math.eval($("#cpf-continuous-uniform-aInt").val()),
			        bInt = math.eval($("#cpf-continuous-uniform-bInt").val()),
			        aAccum = math.eval($("#cpf-continuous-uniform-aAccum").val()),
			        bAccum = math.eval($("#cpf-continuous-uniform-bAccum").val());

			    // Some cases -- THIS NEEDS SOME WORK...
			    var HTMLout;
			    if (bAccum < aInt) {
		          HTMLout = 'Cumulative Probability equals 0: the end of accumulation occurs before the start of the interval of the uniform distribution.';
		        }
		        else if (aAccum > bInt) {
		          HTMLout = 'Cumulative Probability equals 0: the start of accumulation occurs after the end of the uniform distribution.';
		        }
		        else if (aAccum <= aInt && bAccum >= aInt) {
		          HTMLout = `
		          \\[\\frac{( ${chopDecimals(Math.min(bAccum, bInt), 3)} )-( ${chopDecimals(aInt, 3)} )} {( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aInt, 3)} )} = ${((Math.min(bAccum, bInt) - aInt) / (bInt - aInt)).toFixed(statcalc.decimals)} \\]
		          `
		      	}
		        else if (aAccum >= aInt && bAccum <= bInt) {
		          HTMLout = `
		          \\[\\frac{( ${chopDecimals(bAccum, 3)} )-( ${chopDecimals(aAccum, 3)} )} {( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aInt, 3)} )} = ${((bAccum - aAccum) / (bInt - aInt)).toFixed(statcalc.decimals)} \\]
		          `;
			    }
		        else if (aAccum <= bInt && bAccum >= bInt) {
		          HTMLout = `
		          \\[\\frac{( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aAccum, 3)} )} {( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aInt, 3)} )}= ${((bInt - aAccum) / (bInt - aInt)).toFixed(statcalc.decimals)} \\]
		          `
			    }
		        else if (aAccum <= aInt && bAccum >= bInt) {
		          HTMLout = `
		          \\[\\frac{( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aInt, 3)} )} {( ${chopDecimals(bInt, 3)} )-( ${chopDecimals(aInt, 3)} )} = 1 \\]
		          `
		        }
		        else {
		          throw "Invalid input";
		        }

		        $("#cpf-continuous-uniform-calculation").html(HTMLout);
		        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


		        $("#cpf-continuous-uniform-board").css({
		          width: "450px",
		          height: "350px"
		        });
		        var intWidth = bInt - aInt;
		        var board = JXG.JSXGraph.initBoard('cpf-continuous-uniform-board', {
		          boundingbox: [Math.min(aInt, aAccum) - 0.5 * intWidth, 1.2, Math.max(bInt, bAccum) + 0.5 * intWidth, -0.2],
		          axis:true,
		          showNavigation: false,
		          showCopyright: false
		        });
		        var cpf_continuous_uniform_f = function(x, aInt, bInt) {
		          if (x < aInt) {
		            return 0;
			      }
		          else if (x > bInt) {
		          	return 1;
		          }
		          else {
		            return 1/(bInt - aInt) * (x - aInt);
			      }
			    }

		        board.create("functiongraph", [
		          function(x){return cpf_continuous_uniform_f(x, aInt, bInt)}
		        ], statcalc.jsxg.properties.functiongraph);

		        // Points with labels
		        board.create("point", [aAccum, cpf_continuous_uniform_f(aAccum, aInt, bInt)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          aAccum,
		          cpf_continuous_uniform_f(aAccum, aInt, bInt),
		          "$(" + aAccum + ", C_{CU}(" + aAccum + "|" + aInt + "," + bInt + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        })
		        board.create("point", [bAccum, cpf_continuous_uniform_f(bAccum, aInt, bInt)], statcalc.jsxg.properties.point)
		        board.create("text", [
		          bAccum,
		          cpf_continuous_uniform_f(bAccum, aInt, bInt),
		          "$(" + bAccum + ", C_{CU}(" + bAccum + "|" + aInt + "," + bInt + "))$"
		        ], {
		          fixed:true, highlight:false, anchorX:"left", anchorY:"bottom", fontSize:16, useMathJax: true
		        });


			} catch(err){
				$("#cpf-continuous-uniform-calculation").html(`
					<p class="red">Invalid Input</p>
				`);
			}
		})
	},

	description: {
		title: "Continuous Uniform Distribution",
		body: `
    	Continuous Uniform situations are much like Discrete Uniform situations. However, there are two important differences.  First, in the Continuous Uniform situation, the stochastic variable of interest may take on any conceivable value in a given interval.  If the given interval is $[0,10]$, then we could observe (ignoring measurement errors) an object which has the value of $\\pi$ or $\\sqrt[2]{2}$ in addition to values like 3 and 7.5. The second way that a Continuous Uniform situation is different from a Discrete Uniform situation is in what we assume is \"fair\" (i.e. the same) for all values of the stochastic variable.  In the Continuous Uniform situation, we will assume that there is a <i>Constant Rate of Change</i> function (PDF) defined as $$CU\\left(x|a,b\\right)=\\begin{cases}\\frac{1}{b-a}&\\text{ if }a\\leq x\\leq b\\\\0&\\text{ otherwise.}\\end{cases}$$ where the parameter <i>a</i> is the smallest possible value that the stochastic variable may take on and the parameter <i>b</i> is the largest possible value.<br/><br/> The cumulative probability function (CPF/CDF) for a Continuous Uniform situation is given by $$C_{CU}\\left(x|a,b\\right)=\\begin{cases} 0 & \\text{ if } x &lt; a \\\\ \\frac{x-a}{b-a}&\\text{ if } a\\leq x\\leq b\\\\1&\\text{ if } x &gt; b.\\end{cases}$$ When a stochastic variable follows a continuous distribution, we will write $X\\sim\\mathcal{Uni}(a,b)$.

		`
	}
}