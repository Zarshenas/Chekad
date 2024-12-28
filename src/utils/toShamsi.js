import moment from "jalali-moment";

export const toShamsi = (data)=>{
    const transformedData = data.map((item) => ({
        ...item.toObject(),
        createdAt: moment(item.createdAt).locale('fa').format('jYYYY/jMM/jDD'),
        updatedAt: moment(item.updatedAt).locale('fa').format('jYYYY/jMM/jDD'),
      }));
    return transformedData
}