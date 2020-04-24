<?php
/* Author: Marleen van Gent
 */

/*
 *Provides an interface for the visualizations, using the strategy design pattern
 */

interface VisualizationStrategy {
    public function makeVisualization();
}

class VisualizationHeatMap implements VisualizationStrategy {
    public function makeVisualization() {
        return 1;
    }
}

class VisualizationScanpath implements VisualizationStrategy {
    public function makeVisualization() {
        return 2;
    }
}

?>