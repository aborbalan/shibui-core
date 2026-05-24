export interface ScatterPoint3d {
  x: number;
  y: number;
  z: number;
  label?: string;
}

export interface ScatterSeries3d {
  name: string;
  points: ScatterPoint3d[];
}

export interface ScatterTooltip3d {
  svgX: number;
  svgY: number;
  content: string;
  color: string;
}

export interface ProjectionConfig {
  ox:        number;
  oy:        number;
  scale:     number;
  azimuth:   number;
  elevation: number;
}

export interface ScatterChart3dTemplateProps {
  series:        ScatterSeries3d[];
  colors:        readonly string[];
  xLabel:        string;
  yLabel:        string;
  zLabel:        string;
  showGrid:      boolean;
  showLegend:    boolean;
  dotRadius:     number;
  svgWidth:      number;
  height:        number;
  tooltip:       ScatterTooltip3d | null;
  azimuth:       number;
  elevation:     number;
  isDragging:    boolean;
  onMouseDown:   (e: MouseEvent) => void;
  onDotEnter:    (e: MouseEvent, point: ScatterPoint3d, seriesIndex: number, color: string) => void;
  onDotLeave:    () => void;
}
