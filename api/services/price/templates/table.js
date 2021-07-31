const TABLE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
        }

        h2 {
            font-size: 36px;
            margin: 0 0 10px 0
        }

        p {
            margin: 0 0 10px 0
        }

        table.width200, table.rwd_auto {
            border: 1px solid #ccc;
            width: 100%;
            margin: 0
        }

        .width200 th, .rwd_auto th {
            background: #ccc;
            padding: 5px;
            text-align: center;
        }

        .width200 td, .rwd_auto td {
            border-bottom: 1px solid #ccc;
            padding: 5px;
            text-align: center
        }

        .width200 tr:last-child td, .rwd_auto tr:last-child td {
            border: 0
        }

        .rwd {
            width: 100%;
            overflow: auto;
        }

        .rwd table.rwd_auto {
            width: auto;
            min-width: 100%
        }

        .rwd_auto th, .rwd_auto td {
            white-space: nowrap;
        }
        
        .arrow {
            margin-left: 3px;
        }

        .price {
            display: flex;
            align-items: center;
            justify-content: center;
        }

    </style>
</head>
<body>
<div class="rwd">
    <table class="rwd_auto">
        <thead>
        <tr>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Coste</th>
            <th>Diferencia</th>
        </tr>
        </thead>
        <tbody>
        {{#prices}}
        <tr>
            <td>{{product}}</td>
            <td>{{provider}}</td>
            <td>{{price}}</td>
            <td class="price">{{diff}}
              <span class="arrow" {{downHidden}}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10pt"
                         height="10pt" viewBox="0 0 10 10" version="1.1">
                        <g id="surface1">
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,100%,0%);fill-opacity:1;"
                              d="M 10 0.0117188 C 10 0.0351562 5 10.011719 4.992188 10 C 4.964844 9.964844 -0.0078125 0.0078125 0 0.00390625 C 0.0078125 0 1.132812 0.484375 2.503906 1.078125 L 4.996094 2.160156 L 7.488281 1.078125 C 8.855469 0.484375 9.980469 0 9.988281 0 C 9.996094 0 10 0.00390625 10 0.0117188 Z M 10 0.0117188 "/>
                        </g>
                        </svg>
                </span>
                <span class="arrow" {{upHidden}}>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="10pt" height="10pt" viewBox="0 0 10 10" version="1.1">
                        <g id="surface1">
                        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,0%,0%);fill-opacity:1;" d="M 10 9.988281 C 10 9.964844 5 -0.0117188 4.992188 0 C 4.964844 0.0351562 -0.0078125 9.992188 0 9.996094 C 0.0078125 10 1.132812 9.515625 2.503906 8.921875 L 4.996094 7.839844 L 7.488281 8.921875 C 8.855469 9.515625 9.980469 10 9.988281 10 C 9.996094 10 10 9.996094 10 9.988281 Z M 10 9.988281 "/>
                        </g>
                    </svg>
                </span>
            </td>
        </tr>
        {{/prices}}
        </tbody>
    </table>
</div>
</body>
</html>`;

module.exports = { TABLE_TEMPLATE };
