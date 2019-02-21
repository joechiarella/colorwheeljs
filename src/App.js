import React, { Component } from 'react';
import './App.css';
import PaperSetup from './PaperSetup.js'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ResizeAware from 'react-resize-aware';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';

var paperStyle = {
  width: '100%',
  height: '100%'
}

class App extends Component {

  state = {
    value: 50,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { value } = this.state;
    return (
      <div className="App">
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Paper>
              <Typography id="label">Slider label</Typography>    
              <Slider
                value={value}
                aria-labelledby="label"
                onChange={this.handleChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <PaperSetup className="PaperSetup"/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// const AppStyled = withStyles(styles)(App);

export default App;
