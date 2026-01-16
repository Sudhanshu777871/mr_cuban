import React, { useEffect, useRef } from "react";
import img from "../assets/favicon.png"; // Importing the image

const HereMap = ({params}) => {

    const {q,start,end} = params;
  const mapRef = useRef(null);

  useEffect(() => {
    if(params){
        const platform = new window.H.service.Platform({
            apikey: "ItLUx_UUH1X4cxsWZcLX_pn7038DjCzCtmGe7roO9Qs", // Replace with your API key
          });
          const defaultLayers = platform.createDefaultLayers();
      
          // Create the map
          const map = new window.H.Map(
            mapRef.current,
            defaultLayers.vector.normal.map,
            {
              zoom: 10,
              center: { lat: 52.53086, lng: 13.38474 }, // Default center (Berlin)
            }
          );
      
          // Enable event system
          const mapEvents = new window.H.mapevents.MapEvents(map);
          new window.H.mapevents.Behavior(mapEvents); // Enable map behavior (zooming, panning)
      
          // Enable UI
          const ui = window.H.ui.UI.createDefault(map, defaultLayers);
          const iconOptions = {
            size: { w: 44, h: 44 },
          };
      
          // Get user location and set marker
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { latitude, longitude } = position.coords;
      
              const marker = new window.H.map.Marker(
                { lat: latitude, lng: longitude },
                {
                  icon: new window.H.map.Icon(img, iconOptions),
                }
              );
              map.addObject(marker);
              // Add the marker to the map
              // map.addObject(userMarker);
      
              // Center the map on user's location
              map.setCenter({ lat: latitude, lng: longitude });
      
              // Create an info bubble (tooltip) with user location data
              const infoBubble = new window.H.ui.InfoBubble(
                { lat: latitude, lng: longitude },
                {
                  content: `<div class="tooltip">
                            <h4>${q||"ddd"}</h4>
                            <div class="box">
                            <i class='bx bxs-map'></i>
                            <p>${start}</p>
                            </div>
                            <div class="box">
                            <i class='bx bxs-map'></i>
                            <p>${end}</p>
                            </div> 
                            <div class="line"></div>                     
                            
                          </div>`,
                }
              );
      
              // Add the info bubble to the UI (hidden by default)
              ui.addBubble(infoBubble);
              infoBubble.close(); // Initially closed
      
              // Show the info bubble when clicking on the marker
              marker.addEventListener("tap", () => {
                infoBubble.open();
              });
            });
          }
    }
  
    
  }, [params]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100vh", }} // Adjust the height or width as needed
    />
  );
};

export default HereMap;
