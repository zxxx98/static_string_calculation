import { Parser } from "./Parser";
import { Scanner } from "./Scanner";

class Main {
    constructor() {

    }

    public static use() {
        // let scanner = new Scanner();
        // scanner.setText("1+min(2,3,4)");
        // let textInfos = scanner.scan();
        // let parser = new Parser();
        // let map = new Map();
        // map.set("ab", "cd+1");
        // map.set("cd", "2");
        // parser.setVariables(map);
        // let root = parser.parser(textInfos);
        // console.log(root.calculation())
        let scanner = new Scanner();
        scanner.setText("6(3-3*3)");
        let textInfos = scanner.scan();
        let parser = new Parser();
        // let map = new Map();
        // map.set("ab", "cd+1");
        // map.set("cd", "2");
        // parser.setVariables(map);
        let root = parser.parser(textInfos);
        console.log(root.calculation());
    }
}
Main.use();