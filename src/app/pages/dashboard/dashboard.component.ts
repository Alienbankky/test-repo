import { Component,OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';


import { enableRipple, Ajax, removeClass,Browser } from '@syncfusion/ej2-base';
enableRipple(true);


import { StockChart, Chart, ColumnSeries, Category } from '@syncfusion/ej2-charts';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { DateTime, AreaSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, LineSeries, SplineSeries  } from '@syncfusion/ej2-charts';
import { AccumulationDistributionIndicator, AtrIndicator, BollingerBands, EmaIndicator, MomentumIndicator } from '@syncfusion/ej2-charts';
import { MacdIndicator, RsiIndicator, Trendlines, SmaIndicator, StochasticIndicator, Export } from '@syncfusion/ej2-charts';
import { TmaIndicator, RangeTooltip, Tooltip, Crosshair , IStockChartEventArgs, ChartTheme,IPointRenderEventArgs,Logarithmic, 
    StripLine, IAxisLabelRenderEventArgs, ITooltipRenderEventArgs} from '@syncfusion/ej2-charts';
StockChart.Inject(DateTime, AreaSeries, CandleSeries, HiloOpenCloseSeries, HiloSeries, LineSeries, SplineSeries);
StockChart.Inject(AccumulationDistributionIndicator, AtrIndicator, BollingerBands, EmaIndicator, MomentumIndicator);
StockChart.Inject(MacdIndicator, RsiIndicator, SmaIndicator, StochasticIndicator);
StockChart.Inject(Trendlines, TmaIndicator, RangeTooltip, Tooltip, Crosshair, Export);

declare var jquery:any;
declare var $ :any;
declare var google: any;

@Component({
    moduleId: module.id,
    selector: 'maps-cmp',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    [x: string]: any;
    
    
    ngOnInit(){
        var marker;
        var map ;
        var latlng = new google.maps.LatLng(15, 100);
        var mapOptions = {
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          center: latlng,
          scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
          // styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
        }
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        
        var countiesTiles = {
          getTileUrl: function(coord, zoom) {EPSG:900913
                   
          var tile_url='http://35.224.250.109:8080/geoserver/gwc/service/wmts?layer=satellite_pim:NDVIMODIS2018_NDVI_REPROJ_v2&style=&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:900913:'+zoom+'&TileRow='+coord.y +'&TileCol='+coord.x  	 
          return tile_url

          },
          tileSize: new google.maps.Size(256, 256),
          isPng: true,
          opacity: 0.6
              };
              var customMapType = new google.maps.ImageMapType(countiesTiles);
              map.overlayMapTypes.insertAt(0, customMapType);
            
              google.maps.event.addListener(map, 'click', function(event){
              placeMarker(event.latLng);
   
          });
         
          function placeMarker  (location) {
            if (marker == undefined){
                marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    animation: google.maps.Animation.DROP,
                    draggable:true,
                });
                    renderChart()
            }
            else{
                marker.setPosition(location);
            }

            map.setCenter(location);
            console.log(marker.position);
  
            //curl -X POST "http://localhost:5000/ndvi" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"lat\": \"100.14\",  \"lng\": \"16.55\"}"
            var lat=marker.position.lng()
            var lng=marker.position.lat()
            var serviceUrl=  "https://api-ndvi.appspot.com/ndvi"
            // var serviceUrl=  "http://127.0.0.1:5000/chartData"
            var jsonData= {  lat: lat,  lng:lng}
            var StrjsonData=JSON.stringify(jsonData);
          
         $.ajax({
            url: serviceUrl,
            type: "POST",
            dataType: "json",
            data: StrjsonData,
            contentType: "application/json",
            success: function(result){
            console.log(result[0],);
            // var data = result  // สร้าง Object เพื่อเก็บ Arary ของดาวเทียมทั้งหมดจาก JSON File
            // var index = data['chartData'];  // สร้างตัวแปร gistdajson เพื่อดึง Array ของ Services ออกมา 
            // var gistdaname = index[0]["ndvi"]; // L02_landsat8/ls8_20140124_20150421_thailand_psp_enh จะได้แต่ name
            //  var contentString= '<div id="content">'+
            //     '<p>NDVI = '+ result[0] +' </p>'+
            //     '</div>'; 
            // //  contentString=result[0]
            alert('NDVI = '+ result[0])
            
          }
          
          
        }); 
        
       
        }

        


      
    
    

        function renderChart(){

            var lat=marker.position.lng()
            var lng=marker.position.lat()
            var serviceUrl=  "http://127.0.0.1:5000/chartData"
            var jsonData= {  lat: lat,  lng:lng}
            var StrjsonData=JSON.stringify(jsonData);
            $.ajax({ 
                type: "POST", 
                url: serviceUrl, 
                data: StrjsonData,
                contentType: "application/json; charset=utf-8", 
                dataType: 'json', 
                success: function (data) { 
                    console.log('success', data); 
                    // var dateString  = data['dates'];
                    // var st = "yyyy-mm-dd"
                    // var dt = new Date();
                    // var dt_st = dateString

                    let stockChart: StockChart = new StockChart({
                        primaryXAxis: { valueType: 'DateTime', majorGridLines: { width: 0 }, crosshairTooltip: { enable: true }},
                        primaryYAxis: {
                            lineStyle: { color: 'transparent' },
                            majorTickLines: { color: 'transparent', width: 0 },
                        },
                        chartArea: { border: { width: 0 } },
                           series: [
                               {
                                   dataSource: data['chartData'], 
                                   xName: 'dates', 
                                   yName: 'ndvi', 
                                   type : "Line",
                               }
                           ],
                        tooltip: { enable: true},
                        crosshair: { enable: true},
                        seriesType : [],
                        indicatorType : [],
                        title: 'ข้อมูลดัชนีพืชพรรณ',
                        load: (args: IStockChartEventArgs) => {
                            let selectedTheme: string = location.hash.split('/')[1];
                            selectedTheme = selectedTheme ? selectedTheme : 'Material';
                            args.stockChart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
                                selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i,  'Contrast');
                        }
                    });
                       stockChart.appendTo('#container');
                }, 
                error: function (jqXHR, textStatus, errorThrown) { 
                    alert('Exeption:' + errorThrown); 
                } 
            }); 
            
     
        //    let stockChart: StockChart = new StockChart({
        //        primaryXAxis: { valueType: 'DateTime', majorGridLines: { width: 0 }, crosshairTooltip: { enable: true }},
        //        primaryYAxis: {
        //            lineStyle: { color: 'transparent' },
        //            majorTickLines: { color: 'transparent', width: 0 },
        //        },
        //        chartArea: { border: { width: 0 } },
        //           series: [
        //               {
        //                   dataSource: chartData, 
        //                   xName: 'date', 
        //                   yName: 'ndvi', 
        //                   type : "Line",
        //               }
        //           ],
        //        tooltip: { enable: true},
        //        crosshair: { enable: true},
        //        seriesType : [],
        //        indicatorType : [],
        //        title: 'ข้อมูลดัชนีพืชพรรณ',
        //        load: (args: IStockChartEventArgs) => {
        //            let selectedTheme: string = location.hash.split('/')[1];
        //            selectedTheme = selectedTheme ? selectedTheme : 'Material';
        //            args.stockChart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
        //                selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i,  'Contrast');
        //        }
        //    });
        //       stockChart.appendTo('#container');
        //       return chartData;
      



    
    } // End Function Renderchart()
    
    




} // End ngOnInit

} // End Export 