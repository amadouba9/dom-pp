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

// Chai for assertions
import pkg_chai from "chai";
const { expect } = pkg_chai;

// JSDOM for DOM trees
import pkg_jsdom from "jsdom";
const { JSDOM } = pkg_jsdom;
import "jsdom-global";

// Local imports
import {CompoundDesignator, ConstantDesignator, DimensionHeight, DimensionWidth, ElementAttributeValue, EnumeratedValue, FindBySelector, ObjectNode, Path, PathValue, ReturnValue, Tracer} from "../index.mjs";

describe("Web element tests", () => {

  describe("FindBySelector", () => {

  /**
   * Tests lineage for the FindBySelector function, giving the ID of an
   * element as the CSS selector. The lineage for this function
   * should produce a tree of the following form:
   * <pre>
   * ReturnValue
   *  |
   *  +-- EnumeratedValue
   *       |
   *       +-- First element
   *            |
   *            +-- id("h2") of Constant
   * </pre>
   */
    it("With ID", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var find = new FindBySelector("#h2");
      var v = find.evaluate(body);
      var elems = v.getValue();
      expect(Array.isArray(elems)).to.be.true;
      expect(elems.length).to.equal(1);
      var e1 = elems[0];
      expect(e1).to.be.an.instanceof(EnumeratedValue);
      var v1 = e1.getValue();
      expect(v1.tagName).to.equal("H2");
      var t = new Tracer();
      var root = t.getUnknownNode();
      var leaves = e1.query(null, ReturnValue.instance, root, t);
      expect(leaves.length).to.equal(1);
      var n = leaves[0];
      expect(n).to.be.an.instanceof(ObjectNode);
      var d = n.getDesignatedObject().getDesignator();
      expect(d).to.be.an.instanceof(CompoundDesignator);
      var tail = d.tail();
      expect(tail).to.be.an.instanceof(Path);
      expect(tail.toString()).to.equal("id(\"h2\")");
      expect(d.head()).to.be.an.instanceof(ConstantDesignator);
    });
  });

  describe("DimensionHeight", () => {

    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var h2 = dom.window.document.querySelector("#h2");
      var f = new DimensionHeight();
      var v = f.evaluate(h2);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(100);
    });
  });

  describe("DimensionWidth", () => {

    it("Value", async () => {
      var dom = await load_dom("./test/pages/stub-1.html");
      var body = dom.window.document.body;
      var h2 = dom.window.document.querySelector("#h2");
      var f = new DimensionWidth();
      var v = f.evaluate(h2);
      expect(v).to.be.an.instanceof(ElementAttributeValue);
      var h = v.getValue();
      expect(h).to.equal(200);
    });
  });
});

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

// :wrap=soft:tabSize=2:indentWidth=2: