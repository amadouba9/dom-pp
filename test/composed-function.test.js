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
import { Addition, ComposedFunction, ComposedFunctionValue, ObjectNode, ReturnValue, Tracer } from "../index.mjs";

describe("Composed function tests", () => {

    describe("Constant composed function", () => {

        it("Result", () => {
            var cf = new ComposedFunction(new Addition(), 1, 2);
            expect(cf.getArity()).to.equal(0);
            var r = cf.evaluate();
            expect(r).to.be.an.instanceof(ComposedFunctionValue);
            var v = r.getValue();
            expect(v).to.equal(3);
        });
    });

    describe("Composed function with a position argument", () => {

        it("Result", () => {
            var cf = new ComposedFunction(new Addition(), "@0", 2);
            expect(cf.getArity()).to.equal(1);
            var r = cf.evaluate(3);
            expect(r).to.be.an.instanceof(ComposedFunctionValue);
            var v = r.getValue();
            expect(v).to.equal(5);
            var t = new Tracer();
            var root = t.getUnknownNode();
            var leaves = r.query(null, ReturnValue.instance, root, t);
            expect(leaves.length).to.equal(2);
        });
    });

    describe("Composed function with a named argument", () => {

        it("Result", () => {
            var cf = new ComposedFunction(new Addition(), "$x", 2);
            expect(cf.getArity()).to.equal(1);
            var r = cf.evaluate(3);
            expect(r).to.be.an.instanceof(ComposedFunctionValue);
            var v = r.getValue();
            expect(v).to.equal(5);
            var t = new Tracer();
            var root = t.getUnknownNode();
            var leaves = r.query(null, ReturnValue.instance, root, t);
            expect(leaves.length).to.equal(2);
        });

        it("Set", () => {
            var cf = new ComposedFunction(new Addition(), "$x", 2).set("$x", 3);
            var r = cf.evaluate(10);
            expect(r).to.be.an.instanceof(ComposedFunctionValue);
            var v = r.getValue();
            expect(v).to.equal(5);
            var t = new Tracer();
            var root = t.getUnknownNode();
            var leaves = r.query(null, ReturnValue.instance, root, t);
            expect(leaves.length).to.equal(2);
            var leaf1 = leaves[0];
            var leaf2 = leaves[1];
            expect(leaf1.getChildren().length).to.equal(0);
            expect(leaf2.getChildren().length).to.equal(0);
        });
    });
});

// :wrap=soft:tabSize=2:indentWidth=2: