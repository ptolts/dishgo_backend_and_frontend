class Email < ActionMailer::Base
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

  def welcome user
    mail(:to => user.email, :subject => "Welcome to DishGo!").deliver  
    notify_admins user
  end

  def notify_admins user
    @user = user
    mail(:to => "phil@dishgo.io", :subject => "New User", template_name: 'notify_admins').deliver
    mail(:to => "tim@dishgo.io", :subject => "New User", template_name: 'notify_admins').deliver
  end
end
