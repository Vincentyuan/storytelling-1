
import { PieChartComponent, AdvancedPieChartComponent, BarChartComponent, ForceDirectedGraphComponent, GaugeChartComponent,
  HierarchicalEdgeBundlingComponent, PieGridChartComponent, LineChartComponent, DendogramComponent, NgGraphComponent,
  TreemapChartComponent, AreaChartComponent,
    BubbleChartComponent, ZoomableTreemapChartComponent
}  from "app/charts";


function createChartType({title, ...obj}) {
  return {
    title,
    name: titleToName(title),
    dimLabels: [{column: 'Group by', maxSize: 1} , {column: 'Name', maxSize: 1} ,{column: 'Value', maxSize: 1}],
    ...obj
  };

  function titleToName(s: string) {
    return s.toLowerCase().replace(/\ /g, '-');
  }
}


export const chartTypes = [
  createChartType({ title: 'Bar Chart', simpleData: true, cmpName: 'barChart', convertData: BarChartComponent.convertData ,dimLabels: [ {column: 'Name', maxSize: 1} , {column: 'Value', maxSize: 1} ]}),
  createChartType({ title: 'Pie Chart', simpleData: true, cmpName: 'pieChart', convertData: PieChartComponent.convertData ,dimLabels: [ {column: 'Name', maxSize: 1} , {column: 'Value', maxSize: 1} ] }),
  createChartType({ title: 'Dendogram', simpleData: true, cmpName: 'dendogram', convertData: DendogramComponent.convertData ,dimLabels: [ {column: 'Group by', maxSize: 10}, {column: 'Value', maxSize: 1} ] }),
  createChartType({ title: 'Zoomable Treemap', simpleData: true, cmpName: 'zoomableTreemapChart', convertData: ZoomableTreemapChartComponent.convertData, dimLabels: [ {column: 'Hierarchy', maxSize: 2} , {column: 'Value', maxSize: 1} ] }),
  createChartType({ title: 'Pie Grid Chart', simpleData: true, cmpName: 'pieGridChart', convertData: PieGridChartComponent.convertData, dimLabels: [ {column: 'Name', maxSize: 1} ,{column: 'Value', maxSize: 1} ] }),
  createChartType({ title: 'Force Layout Bubble', simpleData: true, cmpName: 'bubbleChart', convertData: BubbleChartComponent.convertData, dimLabels: [ {column: 'category', maxSize: 1} ,{column: 'Label', maxSize: 1} ,{column: 'Value', maxSize: 1} ,{column: 'Description', maxSize: 1} ] }),
  createChartType({ title: 'Force Directed Graph', simpleData: true, cmpName: 'ForceDirectedGraph', convertData: ForceDirectedGraphComponent.convertData ,dimLabels: [{column: 'node', maxSize: 1} ,{column: 'Group', maxSize: 1} ,{column: 'Value', maxSize: 1}] }),
  createChartType({ title: 'Bar Vertical 2D', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Horizontal 2D', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Vertical Stacked', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Vertical Normalized', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Bar Horizontal Normalized', convertData: NgGraphComponent.convertData }),
  createChartType({ title: 'Polar Chart', convertData: NgGraphComponent.convertData, dimLabels: [{column: 'Group by', maxSize: 1} , {column: 'Angle Values', maxSize: 1} ,{column: 'Radius Values', maxSize: 1}] }),
  createChartType({ title: 'Line Chart', convertData: NgGraphComponent.convertData, dimLabels: [{column: 'GroupBy', maxSize: 1} , {column: 'x-Values', maxSize: 1} , {column: 'y-Values', maxSize: 1}] }),
  createChartType({ title: 'Heat Map', convertData: NgGraphComponent.convertData, dimLabels: [{column: 'x-Category', maxSize: 1} , {column: 'y-Category', maxSize: 1} , {column: 'Color', maxSize: 1}] }),
  createChartType({ title: 'Bubble Chart', convertData: NgGraphComponent.convertData, dimLabels: [{column: 'GroupBy', maxSize: 1} , {column: 'x-Values', maxSize: 1} , {column: 'y-Values', maxSize: 1}, {column: 'Radius', maxSize: 1}] }),
  createChartType({ title: 'Treemap', simpleData: true, cmpName: 'treemapChart', convertData: TreemapChartComponent.convertData, dimLabels: [{ column: 'Group by', maxSize: 10 }, { column: 'Value', maxSize: 1 }]}),
  createChartType({ title: 'Advanced Pie Chart', simpleData: true, cmpName: 'AdvancedPieChart', convertData: AdvancedPieChartComponent.convertData, dimLabels: [{ column: 'Group by', maxSize: 1 }, { column: 'Value', maxSize: 1 }] }),
  createChartType({ title: 'Gauge Chart', simpleData: true, cmpName: 'GaugeChart', convertData: GaugeChartComponent.convertData, dimLabels: [{ column: 'Group by', maxSize: 1 }, { column: 'Value', maxSize: 1 }] }),
  createChartType({ title: 'Area Chart', simpleData: true, cmpName: 'areaChart', convertData: AreaChartComponent.convertData, dimLabels: [{ column: 'Group by', maxSize: 1 }, { column: 'x-Values', maxSize: 1 }, { column: 'y-Values', maxSize: 1 }] })

];
