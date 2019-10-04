import React from 'react';
import { render } from 'react-dom';
import MonsterView from './components/monster/MonsterView';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

// Now we can render our application into it
render( <MonsterView />, document.getElementById('root') );
