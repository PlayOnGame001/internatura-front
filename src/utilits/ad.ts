export interface Bidder {
  bidder: string;
  params: Record<string, any>;
}

const initializedBanners = new Set<string>();

export function initBannerAd(
  id: string,
  sizes: number[][] = [[300, 250]],
  bidders: Bidder[] = [{ bidder: "adtelligent", params: { aid: 350975 } }]
) {
  if (!window.pbjs) {
    console.warn(`⚠️ Prebid.js не загружен для ${id}`);
    return;
  }

  if (initializedBanners.has(id)) {
    return;
  }
  initializedBanners.add(id);

  const events = ["BID_REQUESTED", "BID_RESPONSE", "BID_WON", "AUCTION_END", "BID_TIMEOUT"];
  events.forEach((event) => {
    window.pbjs.onEvent(event, (data: any) => {
      if (data.adUnitCode === id || data.adUnits?.[0]?.code === id) {
        console.log(`[Prebid ${id}] ${event}:`, data);
      }
    });
  });

  window.pbjs.setBidderConfig?.({
    config: {
      adtelligent: { chunkSize: 1 },
    },
  });

  const adUnit = {
    code: id,
    mediaTypes: { banner: { sizes } },
    bids: bidders,
    deferRendering: false,
  };

  window.pbjs.que = window.pbjs.que || [];
  window.pbjs.que.push(() => {
    window.pbjs.addAdUnits(adUnit);
    window.pbjs.requestBids({
      adUnitCodes: [id],
      timeout: 3000,
      bidsBackHandler: () => {
        const bids = window.pbjs.getHighestCpmBids(id);
        const container = document.getElementById(id);
        
        if (!container) {
          console.error(`⚠️ Контейнер ${id} не найден`);
          return;
        }

        try {
          if (bids.length > 0 && bids[0].ad) {
            const bid = bids[0];
            console.log(`✅ Rendering ad for ${id}`, {
              cpm: bid.cpm,
              size: `${bid.width}x${bid.height}`,
              adId: bid.adId,
              adLength: bid.ad?.length
            });
            
            container.innerHTML = '';
            
            const iframe = document.createElement('iframe');
            iframe.id = `${id}-iframe`;
            iframe.style.width = `${bid.width}px`;
            iframe.style.height = `${bid.height}px`;
            iframe.style.border = 'none';
            iframe.style.margin = '0';
            iframe.style.padding = '0';
            iframe.style.overflow = 'hidden';
            iframe.style.display = 'block';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('scrolling', 'no');
            
            container.appendChild(iframe);
            
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              try {
                iframeDoc.open();
                iframeDoc.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      html, body { 
                        margin: 0; 
                        padding: 0; 
                        overflow: hidden;
                        width: ${bid.width}px;
                        height: ${bid.height}px;
                      }
                    </style>
                  </head>
                  <body>
                    ${bid.ad}
                  </body>
                  </html>
                `);
                iframeDoc.close();
                console.log(`✅ Ad HTML written to iframe for ${id}`);
                setTimeout(() => {
                  const bodyContent = iframeDoc.body?.innerHTML;
                  if (bodyContent && bodyContent.trim().length > 0) {
                    console.log(`✅ Ad successfully loaded in iframe for ${id}`, {
                      bodyLength: bodyContent.length
                    });
                  } else {
                    console.error(`⚠️ Iframe body is empty for ${id}`);
                  }
                }, 100);
                
              } catch (writeError) {
                console.error(`⚠️ Error writing to iframe for ${id}:`, writeError);
                iframe.srcdoc = `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      html, body { 
                        margin: 0; 
                        padding: 0; 
                        overflow: hidden;
                        width: ${bid.width}px;
                        height: ${bid.height}px;
                      }
                    </style>
                  </head>
                  <body>
                    ${bid.ad}
                  </body>
                  </html>
                `;
                console.log(`ℹ️ Using srcdoc fallback for ${id}`);
              }
            } else {
              console.error(`⚠️ Cannot access iframe document for ${id}`);
            }
            
          } else {
            console.warn(`⚠️ No bids received for ${id}`);
            container.innerHTML = `
              <div style="
                width:${sizes[0][0]}px;
                height:${sizes[0][1]}px;
                background:#f9f9f9;
                display:flex;
                align-items:center;
                justify-content:center;
                color:#666;
                font-size:14px;
                border:1px dashed #ddd;
              ">
                No bids
              </div>
            `;
          }
        } catch (e) {
          console.error(`⚠️ Ошибка рендера ${id}:`, e);
          container.innerHTML = `
            <div style="
              width:${sizes[0][0]}px;
              height:${sizes[0][1]}px;
              background:#fdd;
              display:flex;
              align-items:center;
              justify-content:center;
              color:#900;
              font-size:14px;
            ">
              Render error: ${e instanceof Error ? e.message : 'Unknown error'}
            </div>
          `;
        }
      },
    });
  });
}

export function resetAdCache() {
  initializedBanners.clear();
}