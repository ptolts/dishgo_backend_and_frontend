class HelpEmail < ActionMailer::Base
  default :from => "help@dishgo.io"
  def help params, current_user
    @message = params[:user_message]
    @from = current_user.email
    @time = DateTime.now
    @location = params[:location]
    viewmodel = params[:viewmodel]
    console = params[:console]
    @user_agent = params[:user_agent]
    attachments["viewmodel.json"] = viewmodel
    attachments["console.txt"] = console
    mail(:to => "phil@dishgo.io", :from => @from, :subject => "Dishgo Help").deliver
    mail(:to => "tim@dishgo.io", :from => @from, :subject => "Dishgo Help").deliver
  end
end
