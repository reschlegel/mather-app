import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
       primary: {
          main: '#113a80'
       },
       secondary: {
         main: '#2572b3',
      },
      error: {
         main: '#d32f2f',
      },
      warning: {
        main: '#f57c00',
      },
      info: {
        main: '#339999',
      },
      success: {
        main: '#b0d892',
      }
    }
});
  
export default theme