import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, } from '@nestjs/websockets'; 
import { Server } from 'socket.io'; 
import { TrackingService } from './services/tracking.service'; 

@WebSocketGateway({ cors: true }) 
export class BusGateway 
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect 
{ 
    @WebSocketServer() 
    server: Server; 
    constructor(private readonly trackingService: TrackingService) {} 

    async afterInit() { 
        await this.trackingService.initRoutes(); 
        const buses = await this.trackingService.getAllBusLocations(); 
        
        for (const bus of buses) { 
            const busId = bus.busId.toString();
            const detail = await this.trackingService.getBusDetail(bus.scheduleId.toString());

            this.trackingService.simulateBus(busId, (data) => { 
                // Khi có cập nhật vị trí, merge các trường realtime vào BusDetail
                const updatedDetail = {
                ...detail,
                eta: data.eta ?? detail.eta,
                nextStop: {
                    ...detail.nextStop,
                    name: data.nextStop ?? detail.nextStop.name,
                    distance: data.remainingDistance ?? detail.nextStop.distance,
                },
                lat: data.lat,
                lng: data.lng,
                };

                this.server.emit('busDetail', { busId, detail: updatedDetail });
            }); 
        } 
    } 
    
    async handleConnection(client: any) {
        console.log('Client connected');

        const buses = await this.trackingService.getAllBusLocations(); 
        
        for (const bus of buses) { 
            const busId = bus.busId.toString();
            const stops = await this.trackingService.getStopsFromSchedule(bus.scheduleId.toString());
            this.server.emit('busRoute', { 
                busId: busId, 
                polyline: this.trackingService.getPolyline(busId), 
                stops: stops,
            });
        }
    } 
    
    handleDisconnect(client: any) { 
        console.log('Client disconnected');
    } 
}