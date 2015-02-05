Brooklyn Visualization Demo
===========================

Connects to the Brooklyn REST API to obtain a JSON object containing the full tree of all deployed applications and
renders them using various visualization techniques. The Brooklyn console is assumed to be running on http://localhost:8081/ so
you will need to edit the individual files to change this.

## Bubble Tree

Uses **Radial Bubble Tree Visualization** code (from https://github.com/okfn/bubbletree with patches applied) to display Brooklyn
entities as bubbles. The bubbles are sized according to the total number of child entities and coloured depending on the package name of
the entity type.

## D3.js

Displays **Tree Map**, **Radial Sunburst** and **Packed Circles** renderings, using the D3 JavaScript library. Entities are coloured according to
type.

## TODO

- MoireGraph
- JSPlumb

Copyright 2013 by Andrew Kennedy

> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
> 
>     http://www.apache.org/licenses/LICENSE-2.0
> 
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
