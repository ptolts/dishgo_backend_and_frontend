module ApiHelper
  def validate_auth_token
    user = User.where(:authentication_token => params[:foodcloud_token]).first
    render :status => 401, :json => {errors: [t('api.v1.token.invalid_token')]} if user.nil?
    sign_in user
  end
end