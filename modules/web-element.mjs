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
import { CompoundDesignator, Designator } from "./designator.mjs";
import { AtomicFunction } from "./atomic-function.mjs";
import { Value } from "./value.mjs";
import { Enumerate } from "../index.mjs";
import { EnumeratedValue } from "../index.mjs";
import { AtomicFunctionReturnValue } from "./atomic-function.mjs";

class WebElementFunction extends AtomicFunction
{
    constructor(name)
    {
        super(1);
        this.name = name;
    }

    compute()
    {
        var val = get(arguments[0]);
        return new ElementAttributeValue(this.name, arguments[0], val);
    }

    get(e)
    {
        return null; // To be overridden by descendants
    }
}

class ElementAttribute extends Designator
{
    constructor(name)
    {
        super();
        this.name = name;
    }

    toString()
    {
        return this.name;
    }
}

class ElementAttributeValue extends Value
{
    constructor(name, input, v)
    {
        super();
        this.name = name;
        this.input = Value.lift(input);
        this.value = Value.lift(v);
    }

    get()
    {
        return this.value.getValue();
    }

    toString()
    {
        return this.value.getValue().toString();
    }

    query(q, d, root, factory)
    {
        var leaves = [];
        var new_d = CompoundDesignator.create(new ElementAttribute(this.name), d);
        var n = factory.getObjectNode(new_d, this.input);
        leaves.push(...this.input.query(q, new_d, n, factory));
        root.addChild(n);
        return leaves;
    }
}

/**
 * Function that extracts the width of a DOM node.
 */
class DimensionWidth extends WebElementFunction
{
    constructor()
    {
        super("width");
    }

    get(e)
    {
        var s = e.style.width;
        return parseFloat(s);
    }
}

/**
 * Function that extracts the height of a DOM node.
 */
class DimensionHeight extends WebElementFunction
{
    constructor()
    {
        super("height");
    }

    get(e)
    {
        var s = e.style.height;
        return parseFloat(s);
    }
}

class Path extends Designator
{
    constructor(path)
    {
        this.path = path;
    }

    toString()
    {
        return this.path;
    }
}

class PathValue extends Value
{
    constructor(p, root, value)
    {
        super();
        this.value = Value.lift(value);
        this.root = Value.lift(root);
        this.path = p;
    }

    query(q, d, root, factory)
    {
        var leaves = [];
        var new_d = CompoundDesignator.create(d.tail(), this.path);
        var n = factory.getObjectNode(new_d, this.root);
        leaves.push(...this.root.query(q, new_d, n, factory));
        root.addChild(n);
        return leaves;
    }

    getValue()
    {
        return this.value.getValue();
    }

    toString()
    {
        return this.value.toString();
    }
}

/**
 * Function that produces a list of elements that match a given CSS selector.
 */
class FindBySelector extends Enumerate
{
    /**
     * Creates a new instance of the function.
     * @param selector The CSS selector used to fetch elements
     */
    constructor(selector)
    {
        super();
        this.selector = selector;
    }

    evaluate()
    {
        if (arguments.length != 1)
        {
            throw "Invalid number of arguments";
        }
        var v = Value.lift(arguments[0]);
        var root = v.getValue();
        var elm_list = root.querySelectorAll(this.selector);
        var val_list = [];
        var out_list = [];
        for (var i = 0; i < elm_list.length; i++)
        {
            var path = FindBySelector.getPathTo(elm_list[i]);
            var pv = new PathValue(path, root, elm_list[i]);
            val_list.push(pv);
        }
        for (var i = 0; i < val_list.length; i++)
        {
            out_list.push(new EnumeratedValue(i, val_list));
        }
        return new AtomicFunctionReturnValue(this, out_list, v);
    }

    static getPathTo(element)
     {
        if (element.id!=='')
            return 'id("'+element.id+'")';
        if (element.tagName == "BODY")
            return element.tagName;
    
        var ix= 0;
        var siblings= element.parentNode.childNodes;
        for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            if (sibling===element)
                return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
            if (sibling.nodeType===1 && sibling.tagName===element.tagName)
                ix++;
        }
    }
}

/**
 * Package exports
 */
export {DimensionHeight, DimensionWidth, ElementAttribute, ElementAttributeValue, WebElementFunction};

// :wrap=soft:tabSize=2:indentWidth=2: