/*
  A lineage library for DOM nodes
  MIT License
  
  Copyright (c) 2020-2021 Amadou Ba, Sylvain Hallé
  Eckinox Média and Université du Québec à Chicoutimi
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

/**
 * Abstract class representing a function.
 */
function AbstractFunction()
{
	// Nothing to do in this top level object
};

/**
 * Gets the arity of the function.
 * @return The arity
 */
AbstractFunction.prototype.getArity = function()
{
	return 0;
};

/**
 * Computes the return value of the function from its provided input
 * arguments.
 * @param arguments A variable number of input arguments
 * @return The return value of the function
 */
AbstractFunction.prototype.evaluate = function()
{
	// To be overridden by descendants
	return null;
};

/**
 * Converts an arbitrary object into a {@link Function}.
 * @param o The object to convert. If o is a function, it is returned as is.
 * Otherwise, o is converted into a {@link ConstantFunction} that returns
 * the {@link Value} lifted from o.
 * @return The converted function
 */
AbstractFunction.prototype.lift = function(o)
{
	if (o instanceof AbstractFunction)
	{
		return o;
	}
	return ConstantFunction(Value.prototype.lift(o));
};

/**
 * Binds a variable name to a specific value.
 * @param variable The name of the variable
 * @param value The value to bind this variable to
 */
AbstractFunction.prototype.setTo = function(variable, value)
{
	// To be overridden by descendants
};

/**
 * Atomic designator representing the return value of a function.
 */
function ReturnValue()
{
	AtomicDesignator.call();
};

ReturnValue.prototype.toString = function()
{
	return "!";
};

/**
 * Atomic designator representing one of the input arguments of a function.
 * @param index The index of the input argument
 */
function InputArgument(index)
{
	/**
	 * The index of the input argument
	 */
	this.index = index;
};

InputArgument.prototype.toString = function()
{
	return "@" + this.index;
};

/**
 * Function that performs a direct computation on its input arguments. This is
 * opposed to a {@link ComposedFunction} that calls other functions to produce
 * its return value.
 * @param arity The input arity of the function
 */
function AtomicFunction(arity)
{
	// Inherit from AbstractFunction
	AbstractFunction.call();
	
	/**
	 * The input arity of the function
	 */
	this.arity = arity;
};

AtomicFunction.prototype.evaluate = function()
{
	var values = [];
	for (var i = 0; i < arguments.length; i++)
	{
		values[i] = Value.prototype.lift(arguments[i]);
	}
	return this.compute(values);
};

/**
 * Computes the return value of the function from its input arguments.
 * @param arguments A variable number of {@link Values}, whose number
 * must match the input arity of the function.
 * @return The resulting {@link Value}
 */
AtomicFunction.prototype.compute = function()
{
	if (values.length != this.arity)
	{
		throw "Invalid number of arguments";
	}
	args = [];
	for (var i = 0; i < arguments.length; i++)
	{
		args[i] = arguments[i];
	}
	var o = getValue(args);
	if (o instanceof Value)
	{
		return o;
	}
	return AtomicFunctionReturnValue(o, arguments);
};

AtomicFunction.prototype.getValue = function()
{
	// To be overridden by descendants
	return null;
};

/**
 * Value obtained as the output produced by an atomic function call.
 * @param arguments An output value followed by the function's input arguments
 */
function AtomicFunctionReturnValue()
{
	// Inherit from Value
	Value.call();
	
	/**
	 * The output value produced by the function
	 */
	this.outputValue = arguments[0];
	
	/**
	 * The function's input arguments
	 */
	this.inputValue = [];
	for (var i = 1; i < arguments.length; i++)
	{
		this.inputvalue[i - 1] = arguments[i];
	}
};

AtomicFunctionReturnValue.prototype.getValue = function()
{
	return this.outputValue;
};

AtomicFunctionReturnValue.prototype.toString = function()
{
	return this.outputValue.toString();
};



// :wrap=soft:tabSize=2: