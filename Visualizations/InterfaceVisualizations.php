<?php
/* Author: Marleen van Gent
 */

/*
 *Provides an interface for the visualizations, using the strategy design pattern
 */

interface VisualizationStrategy {
    public function makeVisualization();
}

class Context {
    private $strategy; // I am doubting if this should be $strategy=NULL (what is normal in PHP)?
    
    public function context($choiceStrategy) {
        switch($choiceStrategy) {
            case "H":
                $strategy = new VisualizationHeatmap();
                break;
            case "S":
                $strategy = new VisualizationScanpath();
                break;
                /*
                 * New visualizations need to be added here
                 */
        }
    }
    
    $this->strategy->makeVisualization();
    
}

class VisualizationHeatmap implements VisualizationStrategy {
    public function makeVisualization() {
        return 1;
        //this function of course needs to be expanded with all the calculations for this visualization
    }
}

class VisualizationScanpath implements VisualizationStrategy {
    public function makeVisualization() {
        return 2;
        //this function of course needs to be expanded with all the calculations for this visualization
    }
    //New visualizations need to be added here
}
//when we have a server, this code needs a small test