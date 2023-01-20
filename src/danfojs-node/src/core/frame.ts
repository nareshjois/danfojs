/**
*  @license
* Copyright 2022 JsData. All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* ==========================================================================
*/
import BaseDataFrame from "../../../danfojs-base/core/frame"
import { toCSVNode, toJSONNode } from "../../../danfojs-base/io/node";
import {
    BaseDataOptionType,
    DataFrameInterface,
    CsvOutputOptionsNode,
    JsonOutputOptionsNode,
} from "../../../danfojs-base/shared/types";

type ExtendedDataFrameInterface = DataFrameInterface & {
    toCSV(options?: CsvOutputOptionsNode): string | void
    toJSON(options?: JsonOutputOptionsNode): object | void
}


/**
 * Two-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param data 2D Array, JSON, Tensor, Block of data.
 * @param options.index Array of numeric or string names for subseting array. If not specified, indices are auto generated.
 * @param options.columns Array of column names. If not specified, column names are auto generated.
 * @param options.dtypes Array of data types for each the column. If not specified, dtypes are/is inferred.
 * @param options.config General configuration object for extending or setting NDframe behavior.      
 */
export default class DataFrame extends BaseDataFrame implements ExtendedDataFrameInterface {
    [key: string]: any
    constructor(data?: any, options: BaseDataOptionType = {}) {
        super(data, options)
    }

    /**
     * Converts a DataFrame to CSV. 
     * @param options Configuration object. Supports the following options:
     * - `filePath`: Local file path to write the CSV file. If not specified, the CSV will be returned as a string. Option is only available in NodeJS.
     * - `fileName`: Name of the CSV file. Defaults to `data.csv`. Option is only available in Browser.
     * - `download`: If true, the CSV will be downloaded. Defaults to false. Option is only available in Browser.
     * - `header`: Boolean indicating whether to include a header row in the CSV file.
     * - `sep`: Character to be used as a separator in the CSV file.
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const csv = df.toCSV()
     * console.log(csv)
     * //output
     * "A","B"
     * 1,2
     * 3,4
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const csv = df.toCSV({ header: false })
     * console.log(csv)
     * //output
     * 1,2
     * 3,4
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const csv = df.toCSV({ sep: ';' })
     * console.log(csv)
     * //output
     * "A";"B"
     * 1;2
     * 3;4
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toCSV({ filePath: './data.csv' }) //write to local file in NodeJS
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toCSV({ fileName: 'data.csv', download: true }) //Downloads file in Browser
     * ```
     * 
     */
    toCSV(options?: CsvOutputOptionsNode): string
    toCSV(options?: CsvOutputOptionsNode): string | void {
        return toCSVNode(this, options as CsvOutputOptionsNode)

    }

    /**
     * Converts a DataFrame to JSON. 
     * @param options Configuration object. Supported options:
     * - `filePath`: The file path to write the JSON to. If not specified, the JSON object is returned. Option is only available in NodeJS.
     * - `fileName`: The name of the JSON file. Defaults to `data.json`. Option is only available in Browser.
     * - `download`: If true, the JSON will be downloaded. Defaults to false. Option is only available in Browser.
     * - `format`: The format of the JSON. Supported values are `'column'` and `'row'`. Defaults to `'column'`.
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const json = df.toJSON()
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const json = df.toJSON({ format: 'row' })
     * console.log(json)
     * //output
     * [{"A":1,"B":2},{"A":3,"B":4}]
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * const json = df.toJSON({ format: "column" })
     * console.log(json)
     * //output
     * {"A":[1,3],"B":[2,4]}
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toJSON({ filePath: './data.json' }) // downloads to local file system as data.json in NodeJS
     * ```
     * 
     * @example
     * ```
     * const df = new DataFrame([[1, 2], [3, 4]], { columns: ['A', 'B']})
     * df.toJSON({ fileName: 'data.json', download: true }) // downloads file browser
     * ```
     */
    toJSON(options?: JsonOutputOptionsNode): object
    toJSON(options?: JsonOutputOptionsNode): object | void {
        return toJSONNode(this, options as JsonOutputOptionsNode)
    }

}