class PrizesController < ApplicationController
  before_filter :admin_or_user_with_resto!, :except => [:list, :bid, :won_prize_list] #, :only => [:create_section,:create_dish,:create_option,:create_individual_option]
  before_filter :sign_in_user_for_prizes, only: [:list, :bid, :won_prize_list]
  before_filter :admin_or_prize_owner, only: [:print_list, :destroy]
  layout 'prizes'
  
  def index
    @prizes = current_user.owns_restaurants.prizes.collect{|e| e.serializable_hash({include_individual_prizes:true})}
    restaurant = current_user.owns_restaurants
    if restaurant
      @languages = restaurant.languages.to_json
      @default_language = restaurant.default_language.to_json
    else
      @languages = ['en'].to_json
      @default_language = ['en'].to_json
    end
    render 'index'
  end

  def save
    restaurant = current_user.owns_restaurants
    data = JSON.parse(params[:prize])
    if data["id"].blank?
      prize = Prize.new
    else
      prize = Prize.find(data["id"])
    end
    if prize.restaurant and prize.restaurant != restaurant
      render json: {failure:true}.as_json
      return
    end
    prize.restaurant = restaurant
    prize.name_translations = data["name"]
    format = "%Y-%m-%dT%H:%M:%S.%L%z";
    prize.start_date = Date.strptime(data["start_date"], format).to_time.utc
    prize.end_date = Date.strptime(data["end_date"], format).to_time.utc
    prize.amount = data["amount"]
    prize.quantity = data["quantity"]
    prize.description_translations = data["description"]
    prize.save
    render json: {success:true, id: prize.id}.as_json
  end  

  def create
    data = JSON.parse(params[:prize])
    restaurant = current_user.owns_restaurants
    prize = Prize.new(data)
    prize.restaurant = restaurant
    prize.save
    render json: {success:true}.as_json
  end

  def destroy
    prize = Prize.find(params[:prize_id])
    prize.destroy
    render json: {success:true}.as_json
  end

  def list
    @restaurant_id = params[:restaurant]
    if Prize.where(restaurant_id:@restaurant_id).count == 0
      @restaurant_id = nil
    end
    @languages = ['en'].to_json
    @default_language = ['en'].to_json    
    render 'list', layout: 'list_prizes'
  end

  def prize_list
    @prizes = Prize.ne(active:false)
    # @prizes = Prize.nin(id:current_user.prize_ids)
    render json: @prizes.as_json
  end

  def won_prize_list
    user = current_user
    @prizes = Prize.ne(active:false)
    if !params[:restaurant_id].blank?
      @prizes = @prizes.where(restaurant_id:params[:restaurant_id])
    end
    @prizes = @prizes.collect{|e| e.serializable_hash({current_user:user.id})}
    render json: @prizes.as_json
  end  

  def bid
    data = JSON.parse(params[:prize])
    user = current_user
    if user.dishcoins < data["number_of_bets"]
      render json: {error: "You don't have enough DishCoins!"}.as_json
      return
    end
    prize = Prize.find(data["id"])
    individual_prize = prize.pop_prize

    if !individual_prize
      render json: {error: "This gift certificate has already been won!"}.as_json
      return      
    end

    attempt_count = 0
    attempt_record = []
    while attempt_count < data["number_of_bets"]
      attempt_count += 1

      #If they've bet more than one dishcoin, give them a better chance of winning.
      begin
        attempt = SecureRandom.random_number(prize.chance)
      end while attempt_record.include?(attempt)
      attempt_record << attempt

      user.dishcoins = user.dishcoins - 1
      if attempt == prize.winning_number
        user.individual_prizes << individual_prize
        user.save(validate: false)
        render json: {won: "Congratulations, you've won!"}.as_json
        return
      end      
    end
    Rails.logger.warn "Attempts: #{attempt_record} and the winning number #{prize.winning_number}"
    user.save(validate: false)      
    render json: {lost: "We are sorry, you didn't win this time."}.as_json
    return    
  end

  def destroy
    individual_prizes = @prize.individual_prizes.where(user_id:nil)
    individual_prizes.destroy_all
    if @prize.individual_prizes.count > 0
      render json: @prize.as_json
      return
    end
    @prize.destroy
    render json: {success:true}.as_json
  end

  def print_list
    render :pdf => "prize_list",
      :template => 'prizes/prizes.pdf.erb',
      :show_as_html => params[:debug].present?,
      :page_size => 'Letter',
      :margin => {
                    :top => 0,
                    :bottom => 0,
                    :left   => 0,
                    :right  => 0
                  }    
  end

  def admin_or_prize_owner
    if !current_user
      redirect_to 'https://dishgo.io/app/users/sign_in'
    end
    @prize = Prize.find(params[:prize_id])
    if !current_user.is_admin and current_user.owns_restaurants != @prize.restaurant
      redirect_to 'https://dishgo.io/app/users/sign_in'
    end
  end
end
