import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray  } from '@angular/forms';

import {MdDialog, MdDialogRef} from '@angular/material';
import {JsonValidator } from '../json-validator.directive';

import { Slide } from './slide';
@Component({
    selector: 'app-slide-creator',
    templateUrl: './slide-creator.component.html',
    styleUrls: ['./slide-creator.component.scss'],
})
export class SlideCreatorComponent implements OnInit, AfterViewInit {
    @Output() confirmSlideOpt: EventEmitter<Object> = new EventEmitter();
    @Input() slideIndex: string;
    slide: Slide = new Slide();
    form: FormGroup;
    graphs: Array<any> = [
        {
            value: "barChart",
            type: "Bar Chart"
        }, {
            value: "forceDirectedGraph",
            type: "Force Directed Graph"
        },
        {
            value: "lineChart",
            type: "Line Chart"
        },
        {
            value: "image",
            type: "Image"
        },
        {
            value: "noGraph",
            type: "No Graph"
        }];
    pageLayout: Array<any> = [
        {
            value: "FullScreenGraph",
            type: "Full Screen Graph"
        }, {
            value: "textInCenter",
            type: "Text in Center"
        },
        {
            value: "textInCenterImageBackground",
            type: "Text in Center + Image Background"
        },
        {
            value: "LeftGraphRightText",
            type: "Graph on Left +  Text on Right"
        },
        {
            value: "LeftTextRightGraph",
            type: "Text on Left +  Graph on Right"
        }
    ];
    dataExample: any;
    hasGraph: boolean = false;
    hasText: boolean = false;
    editorOptions: Object = {
        heightMin: 200,
        heightMax: 400,
        charCounterMax: 1000,
        imageUploadURL: 'http://127.0.0.1:3000/api/imagesServer',
        imageManagerLoadURL: 'http://127.0.0.1:3000/api/imagesServer'
    }
    @ViewChild("dataInput") dataInputTab;
    @ViewChild("graphSelector") graphSelector;
    csvJson: any=[];
    constructor(
        public dialog: MdDialog,
        private cdRef: ChangeDetectorRef,
        private _fb: FormBuilder,
    ) {

    }

    ngOnInit() {
        this.form = this._buildForm();

    }
    ngAfterViewInit() {

    }
    private _buildForm() {
        return this._fb.group({
            slideText: new FormControl('', Validators.nullValidator),
            slideGraph: new FormControl('noGraph', Validators.nullValidator),
            pageLayout: new FormControl('pageLayout', Validators.nullValidator),
            graphDataJson: new FormControl(this.dataExample, Validators.compose([JsonValidator()])),
            graphData: this._fb.array([
                this.initData(),
            ])
        });
    }
    confirmSlide() {
        /* to decide which data to take from tab*/
        console.log()
        if (this.hasGraph && !(this.form.value.slideGraph == 'noGraph' || this.form.value.slideGraph == 'image')) {
            switch (this.dataInputTab.selectedIndex) {
                case 0: {
                    if (this.form.value.slideGraph == 'barChart')
                        this.slide.data = this.form.value.graphData;
                    else this.slide.data = [];
                    break;
                }
                case 1: {
                    let data;
                    try {
                        data = JSON.parse(this.form.value.graphDataJson);
                        console.log(data);
                        this.slide.data = data.graphData;
                    }
                    catch (e) {
                        console.log("data format invalidate!!!!!");
                    }
                    break;
                }
                case 2: {
                    let data;
                    try {
                        //data = JSON.parse(this.csvJson);
                        //console.log(data);
                        this.slide.data = this.csvJson;
                    }
                    catch (e) {
                        console.log("data format iImageBackgroundnvalidate!!!!!");
                    }

                    break;
                }
                default: this.slide.data = '';
            }
        }
        if (this.hasGraph)
            this.slide.graph = this.form.value.slideGraph;
        else this.slide.graph = "";
        this.slide.pageLayout = this.form.value.pageLayout;
        if (this.hasText)
            this.slide.text = this.form.value.slideText;
        else this.slide.text = "";
        this.confirmSlideOpt.emit(this.slide);

        this.form = this._buildForm();
        this.slide = new Slide();
        this.csvJson = [];
        console.log("confirm slide:", this.slide);
    }

    initData() {
        let dataForm = {
            index: [''],
            value: ['', Validators.pattern('^[0-9]*$')]
        };
        return this._fb.group(dataForm);
    }
    addData() {
        const control = <FormArray>this.form.controls['graphData'];
        control.push(this.initData());
        console.log(this.form.value);
    }
    graphChange() {
        switch (this.form.value.slideGraph) {
            case "barChart": this.dataExample = barCharDataExample; break;
            case "forceDirectedGraph": this.dataExample = forceDirectedGraphDataExample; break;
            case "lineChart": this.dataExample = lineChartExample; break;
            default: this.dataExample = "{}";
        }
    }
    pageLayoutChange() {
        switch (this.form.value.pageLayout) {
            case "FullScreenGraph": this.hasGraph = true; this.hasText = false; console.log(this.slide); break;
            case "textInCenter": this.hasGraph = false; this.hasText = true; break;
            case "textInCenterImageBackground": this.hasGraph = true; this.hasText = true; break;
            case "LeftGraphRightText": this.hasGraph = true; this.hasText = true; break;
            case "LeftTextRightGraph": this.hasGraph = true; this.hasText = true; break;
            default: ;
        }
    }
    getCsvJson(json) {
        try {
            let j = JSON.parse(json);
            if (this.form.value.slideGraph == "lineChart") {
                this.csvJson.push(j)
            }
            else this.csvJson = j;
        }
        catch (e) {
            console.error("unvalidate json");
        }
    }
    setImageHtml(html) {
        this.slide.fullScreenHtml = html;
    }



}

const barCharDataExample = '{"graphData":[{"index":"index1","value":"21"},{"index":"index2","value":"20"}]}';
const forceDirectedGraphDataExample = '{"graphData":{ "nodes": [{ "id": "a", "group": 1 },{ "id": "b", "group": 1 },{ "id": "c", "group": 2 },  { "id": "d", "group": 2 } ], "links": [{ "source": "a", "target": "b", "value": 1 },  { "source": "a", "target": "d", "value": 2 },{ "source": "b", "target": "c", "value": 3 },  { "source": "c", "target": "a", "value": 4 }  ]}}';
const lineChartExample = '{"graphData":[[{"price" : "1394.46","date" : "Jan 2000",  "symbol" : "S&P 500"}, {"price" : "1366.42",  "date" : "Feb 2000","symbol" : "S&P 500"}, {  "price" : "1498.58","date" : "Mar 2000",  "symbol" : "S&P 500"}],[{"price" : "1285.36","date" : "Jan 2000",  "symbol" : "IBM"}, {"price" : "1299.98",  "date" : "Feb 2000","symbol" : "IBM"}, {  "price" : "1322.20","date" : "Mar 2000",  "symbol" : "IBM"}]]}';