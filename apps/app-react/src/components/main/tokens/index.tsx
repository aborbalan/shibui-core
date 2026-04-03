import { LibBackground } from "@shibui/ui/react";
import TokensIntro from "./templates/ComponentsIntro";



export const TokensPage: React.FC = () => {

  
  return (

    <LibBackground variant="midnight">
      <div style={{ marginTop: '80px', padding: '20px' }}>
      <TokensIntro></TokensIntro>

      </div>
    </LibBackground>


  );
};