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
 * Imports
 */
// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

/**
 * Calls a function and returns true or false depending on whether
 * the call throws an exception. This function is used to circumvent an
 * apparent bug in the c8/chai interaction which fails to mark the
 * <tt>throw</tt> statement as covered using the regular
 * <tt>expect.to.throw</tt> mechanism.
 * @see https://github.com/bcoe/c8/issues/282
 * @param f The function to call
 * @param args The optional arguments to the function
 * @return <tt>true</tt> if an exception has been thrown, <tt>false</tt>
 * otherwise
 */
function expect_to_throw(o, f, ...args)
{
    var thrown = false;
    try
    {
      if (o != null)
      {
        o[f](...args);
      }
      else
      {
        f(...args);
      }
    }
    catch (e)
    {
        thrown = true;
    }
    return thrown;
}

/**
 * Reads a DOM from a file. This function is only meant to avoid cluttering
 * the code with promises and anonymous functions in every test case.
 * @param {String} filename The name of the local file to read from
 * @param A promise which, when fulfilled, returns the DOM object.
 */
async function load_dom(filename)
{
  return JSDOM.fromFile(filename).then(
      (dom) => {return dom;}
  );
}

export {expect_to_throw, load_dom};

// :wrap=soft:tabSize=2:indentWidth=2: