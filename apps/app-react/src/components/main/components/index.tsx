import { LibBackground, LibCard, LibComponentGrid } from "@shibui/ui/react";
import { COMPONENTS_DATA } from "./data/components.data";



export const ComponentsPage: React.FC = () => {

  
  return (

    <LibBackground variant="midnight">
      <div style={{ marginTop: '80px', padding: '20px' }}>

        <LibComponentGrid>
        {COMPONENTS_DATA.map((item) => (
          <LibCard key={item.id} variant="inverse">

            <div slot="tag">{item.index}</div>
            <h3 slot="title">{item.title}</h3>
            <p slot="description">{item.description}</p>
            <span slot="footer">{item.category}</span>
          </LibCard>
  ))}
        </LibComponentGrid>

      </div>
    </LibBackground>


  );
};