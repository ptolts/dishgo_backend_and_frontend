class PrizesController < ApplicationController
  before_filter :admin_or_user_with_resto!, :except => [:list, :bid] #, :only => [:create_section,:create_dish,:create_option,:create_individual_option]
  before_filter :sign_in_user_for_prizes, only: [:list, :bid]
  layout 'prizes'
  
  def index
    @prizes = current_user.owns_restaurants.prizes
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
      prize = Prize.create
    else
      prize = Prize.find(data["id"])
    end
    if prize.restaurant and prize.restaurant != restaurant
      render json: {failure:true}.as_json
      return
    end
    prize.restaurant = restaurant
    prize.name_translations = data["name"]
    prize.start_date = Date.strptime(data["start_date"], "%Y-%m-%dT%H:%M:%S.%L%z")
    prize.end_date = Date.strptime(data["end_date"], "%Y-%m-%dT%H:%M:%S.%L%z")
    prize.amount = data["amount"]
    prize.quantity = data["quantity"]
    prize.description_translations = data["description"]
    prize.save
    render json: {success:true}.as_json
  end  

  def create
    data = JSON.parse(params[:prize])
    restaurant = current_user.owns_restaurants
    prize = Prize.create(data)
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
    @languages = ['en'].to_json
    @default_language = ['en'].to_json    
    @prizes = Prize.all
    render 'list', layout: 'list_prizes'
  end

  def bid
    data = JSON.parse(params[:prize])
    user = current_user
    if user.dishcoins < data["number_of_bets"]
      render json: {error: "You don't have enough DishCoins!"}.as_json
      return
    end
    prize = Prize.find(data["id"])
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
        user.prizes << prize
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
end
