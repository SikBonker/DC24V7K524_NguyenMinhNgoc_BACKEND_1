const { ObjectId } = require("mongodb");
class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }
  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };
    // Remove undefined fields
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key],
    );
    return contact;
  }
  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true },
    );
    return result;
  }

  // Phương thức find(filter) contactService.find(filter) tìm kiếm tài liệu theo bộ lọc filter.
  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  //Phương thức findById(id) contactService.findById(id) tìm kiếm tài liệu theo Id.
  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  //Phương thức update(id, payload) contactService.update(id, payload)
  //cập nhật tài liệu có Id bằng id với dữ liệu mới được cung cấp trong payload.
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" },
    );
    return result; //return result;
  }

  //Phương thức delete(id) contactService.delete(id) xóa tài liệu có Id bằng id.
  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  //Phương thức findFavorite() contactService.findFavorite() tìm kiếm tất cả tài liệu có trường favorite là true.
  async findFavorite() {
    return await this.find({ favorite: true });
  }

  //Phương thức deleteAll() contactService.deleteAll() xóa tất cả tài liệu trong bộ sưu tập.
  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result;
  }
}

module.exports = ContactService;
