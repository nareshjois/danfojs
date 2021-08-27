/**
*  @license
* Copyright 2021, JsData. All rights reserved.
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
import * as tf from '@tensorflow/tfjs-node';
import NDframe from "../../core/generic";
import { table } from "table";
import { _iloc } from "../iloc";
import { _genericMathOp } from "../generic.math.ops";
import Utils from "../../shared/utils"
import { ArrayType1D, ArrayType2D, NdframeInputDataType, DataFrameInterface, BaseDataOptionType } from "../../shared/types";
import Series from '../series';
import ErrorThrower from '../../shared/errors';

const utils = new Utils();

/**
 * One-dimensional ndarray with axis labels.
 * The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index.
 * Operations between DataFrame (+, -, /, , *) align values based on their associated index values– they need not be the same length.
 * @param  Object   
 * 
 *  data:  1D Array, JSON, Tensor, Block of data.
 * 
 *  index: Array of numeric or string names for subseting array. If not specified, indexes are auto generated.
 * 
 *  columnNames: Array of column names. If not specified, column names are auto generated.
 * 
 *  dtypes: Array of data types for each the column. If not specified, dtypes inferred.
 * 
 *  config: General configuration object for NDframe      
 *
 */
/* @ts-ignore */ //COMMENT OUT WHEN METHODS HAVE BEEN IMPLEMENTED
export default class DataFrame extends NDframe implements DataFrameInterface {

    constructor(data: any, options: BaseDataOptionType = {}) {
        const { index, columnNames, dtypes, config } = options;
        super({ data, index, columnNames, dtypes, config, isSeries: false });
        this.$setInternalColumnDataProperty();
    }

    private $setInternalColumnDataProperty() {
        const self = this;
        const columnNames = this.columnNames;
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            Object.defineProperty(this, columnName, {
                get() {
                    return self.$getColumnData(columnName)
                },
                set(arr: ArrayType1D | ArrayType2D) {
                    self.$setColumnData(columnName, arr);
                }
            })
        }

    }

    private $getColumnData(columnName: string) {
        const columnIndex = this.columnNames.indexOf(columnName)

        if (columnIndex == -1) {
            ErrorThrower.throwColumnNotFoundError(this)
        }

        const dtypes = [this.$dtypes[columnIndex]]
        const index = this.$index
        const columnNames = [columnName]
        const config = this.$config

        if (this.$config.isLowMemoryMode) {
            const data = []
            for (let i = 0; i < this.values.length; i++) {
                const row: any = this.values[i];
                data.push(row[columnIndex])
            }
            return new Series(data, {
                dtypes,
                index,
                columnNames,
                config
            })
        } else {
            const data = this.$dataIncolumnFormat[columnIndex]
            return new Series(data, {
                dtypes,
                index,
                columnNames,
                config
            })
        }

    }

    private $setColumnData(columnName: string, arr: ArrayType1D | ArrayType2D): void {

        const columnIndex = this.$columnNames.indexOf(columnName)
        if (columnIndex == -1) {
            ErrorThrower.throwColumnNotFoundError(this)
        }

        if (!(arr.length !== this.shape[1])) {
            ErrorThrower.throwColumnLengthError(this, this.shape[1])
        }

        if (this.$config.isLowMemoryMode) {
            //Update row ($data) array
            for (let i = 0; i < this.$data.length; i++) {
                (this.$data as any)[i][columnIndex] = arr[i]
            }
            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(arr)[0]
        } else {
            //Update row ($data) array
            for (let i = 0; i < this.values.length; i++) {
                (this.$data as any)[i][columnIndex] = arr[i]
            }
            //Update column ($dataIncolumnFormat) array since it's available in object
            (this.$dataIncolumnFormat as any)[columnIndex] = arr

            //Update the dtypes
            this.$dtypes[columnIndex] = utils.inferDtype(arr)[0]
        }

    }

    /**
     * Purely integer-location based indexing for selection by position.
     * 
     * @param rows An array of input, or a string of slice. 
     * @param columns An array of column names, or a string of slice range.
     * Allowed inputs are:
     * 
     *    An integer, e.g. 5.
     * 
     *    A list or array of integers, e.g. [4, 3, 0]
     * 
     *    A slice object with ints, e.g. 1:7.
     * 
    */
    iloc({ rows, columns }: {
        rows?: Array<string | number> | Series,
        columns?: Array<string | number>
    }): DataFrame {
        const df = _iloc({ ndFrame: this, rows, columns }) as DataFrame;
        return df
    }

    // /**
    //   * Returns the first n values in a DataFrame
    //   * @param rows The number of rows to return
    // */
    // head(rows: number = 5): DataFrame {
    //     return this.iloc({ rows: [`0:${rows}`] })
    // }

    // /**
    //   * Returns the last n values in a DataFrame
    //   * @param rows The number of rows to return
    // */
    // tail(rows: number = 5): any {
    //     const startIdx = this.shape[0] - rows
    //     return this.iloc([`${startIdx}:`])
    // }

    // /**
    //  * Gets [num] number of random rows in a dataframe
    //  * @param num The number of rows to return
    //  * @param seed (Optional) An integer specifying the random seed that will be used to create the distribution.
    //   */
    // async sample(num = 5, seed = 1): Promise<DataFrame> {
    //     if (num > this.shape[0]) {
    //         throw new Error("Sample size n cannot be bigger than size of dataset");
    //     }
    //     if (num < -1 || num == 0) {
    //         throw new Error("Sample size cannot be less than -1 or be equal to 0");
    //     }
    //     num = num === -1 ? this.shape[0] : num;

    //     const shuffledIndex = await tf.data.array(this.index).shuffle(num, `${seed}`).take(num).toArray();
    //     const sf = this.iloc({ rows: shuffledIndex });
    //     return sf;
    // }

}