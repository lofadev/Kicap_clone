import Button from '../Button/Button';
import FormGroup from '../FormGroup/FormGroup';
import './FormComment.scss';

const FormComment = () => {
  return (
    <div className='article-comment'>
      <form action='submit' className='form-cmt'>
        <h5 className='form-title'>Viết bình luận của bạn</h5>
        <p className='form-note'>
          Địa chỉ email của bạn sẽ được bảo mật. Các trường bắt buộc được đánh dấu
          <span className='required'> *</span>
        </p>

        <div className='form-main'>
          <FormGroup type='text' labelName='Nội dung' required labelFor='content'></FormGroup>
          <div className='form-container'>
            <FormGroup
              type='input'
              labelName='Họ tên'
              required
              labelFor='fullname'
            ></FormGroup>
            <FormGroup
              type='input'
              labelName='Email'
              required
              labelFor='email'
            ></FormGroup>
          </div>
          <div className='clear'></div>
        </div>

        <div className='form-row'>
          <Button type='button' primary className='form-btn'>
            Gửi bình luận
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormComment;
