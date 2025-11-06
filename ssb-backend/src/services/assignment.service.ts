import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { DriverRepository } from '../repositories/driver.repository';
import { BusRepository } from '../repositories/bus.repository';
import { AssignScheduleDTO } from '../dtos/assignScheduleDTO.dto';
import { UpdateAssignScheduleDTO } from '../dtos/updateAssignSchedule.dto';

@Injectable()
export class AssignScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly driverRepo: DriverRepository,
    private readonly busRepo: BusRepository,
  ) {}
  

  /** Hàm phân công lịch trình */
  async assignSchedule(scheduleId: string, dto: AssignScheduleDTO) {
    const { driverId, busId } = dto;

    // Kiểm tra tồn tại schedule
    const schedule = await this.scheduleRepo.findScheduleById(scheduleId);
    if (!schedule) {
      throw new NotFoundException('Không tìm thấy lịch trình');
    }
    if (driverId === null || busId === null) {
      throw new BadRequestException('Phải cung cấp cả driverId và busId');
    }
    
    // Kiểm tra tài xế tồn tại
    const driver = await this.driverRepo.findDriverById(driverId);
    if (!driver) {
      throw new BadRequestException('Tài xế không tồn tại');
    }

    // Kiểm tra xe tồn tại
    const bus = await this.busRepo.findBusById(busId);
    if (!bus) {
      throw new BadRequestException('Xe buýt không tồn tại');
    }

    // Kiểm tra trùng lịch tài xế/xe nếu muốn mở rộng
    const existing = await this.scheduleRepo.findActiveByDriverOrBus(driverId, busId);
    if (existing) throw new BadRequestException('Tài xế hoặc xe buýt đang bận lịch khác.');

    // Cập nhật lịch trình
    const updated = await this.scheduleRepo.assignSchedule(scheduleId, driverId, busId);
    if (!updated) {
      throw new BadRequestException('Phân công lịch trình thất bại');
    }

    // Trả kết quả
    return {
      message: 'Phân công lịch trình thành công',
      scheduleId: updated._id,
      driver: driver.name,
      bus: bus.plateNumber,
      status: updated.status,
    };
  }

    async getDrivers() {
        return this.driverRepo.findAll();
    }

    async getBuses() {
        return this.busRepo.findAll();
    }

    /** Cập nhật (chỉnh sửa) phân công tài xế / xe buýt */
  async updateAssignment(scheduleId: string, dto: UpdateAssignScheduleDTO) {
    const { driverId, busId } = dto;

    const schedule = await this.scheduleRepo.findScheduleById(scheduleId);
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch trình');

    if (!driverId && !busId) {
      throw new BadRequestException('Phải cung cấp ít nhất 1 trường để cập nhật');
    }

    if (driverId) {
      const driver = await this.driverRepo.findDriverById(driverId);
      if (!driver) throw new BadRequestException('Tài xế không tồn tại');
    }

    if (busId) {
      const bus = await this.busRepo.findBusById(busId);
      if (!bus) throw new BadRequestException('Xe buýt không tồn tại');
    }

    // Kiểm tra trùng lịch (nếu muốn hạn chế driver/bus đang active)
    const existing = await this.scheduleRepo.findActiveByDriverOrBus(driverId, busId);
    if (existing && existing._id.toString() !== scheduleId) {
      throw new BadRequestException(`Tài xế hoặc xe buýt đang bận ở lịch trình khác (${existing.name})`);
    }

    const updated = await this.scheduleRepo.updateAssignment(scheduleId, driverId, busId);
    if (!updated) throw new BadRequestException('Cập nhật phân công thất bại');

    return {
      message: '✅ Cập nhật phân công thành công',
      scheduleId: updated._id,
      driverId: updated.driverId ?? null,
      busId: updated.busId ?? null,
      status: updated.status,
    };
  }

}
