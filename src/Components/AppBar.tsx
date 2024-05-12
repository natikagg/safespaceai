import * as React from 'react';
import { PaletteMode, colors } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import { signOut as amplifySignOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import getUserData from '../UserManagement/getUserData';


const logoStyle = {
  width: '180px',
  height: 'auto',
  cursor: 'pointer',
  margin: '24px',
  padding: '10px',
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function AppNavBar({ }: AppAppBarProps) {

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };

    fetchUserData();
  }, []);

  const callsRemaining = userData ? userData.CallsLeft : 0;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };


  const handleSignOut = async () => {
    try {
      await amplifySignOut();
      navigate('/login'); // Redirect to the login page after signing out
    } catch (error) {
      //console.error('Error signing out: ', error);
    }
  };
  const handleMyAccountClick = () => {
    window.open('https://billing.stripe.com/p/login/fZecNJ3pt4ykfyE5kk', '_blank');
  };  

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <img
                src={
                  '/logo-with-name.png'
                }
                style={logoStyle}
                alt="logo of sitemark"
              />

            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex', alignItems: 'center'},
                gap: 0.5,
                alignItems: 'center',
              }}
            >
                <Typography
                    variant="p"
                    component="div"
                    sx={{ flexGrow: 1, color: 'white', alignSelf: 'center', marginRight: '30px'}}
                >  
                <img style= {{width:'16px', marginRight:'10px'}}src="/whiteSafeSpace.png" alt="" />{ callsRemaining ? `${callsRemaining} calls remaining ` : '0 Calls Remaining'}
                </Typography>
              
              <Button
                color="primary"
                variant="outlined"
                size="medium"
                component="a"
                onClick={handleMyAccountClick}
                sx={{ borderRadius: '20px',
                  color: 'white',
                  border: '2px solid white',
                 }}
              >
                My Account
              </Button>
              <Button 
              variant="text"
              sx={{ color: 'white' }}  
              onClick={handleSignOut} 
              >Logout
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >

              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppNavBar;